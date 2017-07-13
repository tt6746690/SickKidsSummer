import os
import json
from re import match

import numpy as np

from sickkidsproj import app, db
from sickkidsproj.cache.g import ONE_EXONEXPR, TISSUE_SITES, GENE_PANELS, PANEL_REF, OPTION_EXONEXPR, OPTION_RANKING_ALL_GENE, OPTION_RANKING_ALL_GENEPANEL, OPTION_RANKING_GENE, EXT_INC
from sickkidsproj.database.query import get_exonexpr_storepath
from sickkidsproj.database.resources import traverse_resources_dir
from sickkidsproj.utils.check import isEnsemblId


def getSumStat(reads, threshold):
    """ sorts reads and computes summary statistics
        @param int[] reads
        @param int threshold
        @rType sumStat = {
            int[] reads: sorted 
            int median: median of reads 
            boolean over: true if median is over threshold
        }
    """
    reads.sort()

    sumStat = {}
    sumStat["reads"] = reads
    sumStat["median"] = np.percentile(reads, 50)
    sumStat["over"] = True if (sumStat["median"] >= threshold) else False

    return sumStat


def addSumStat(exonExpr, threshold):
    """ Augment input exonExpr with summary statistics 
        on a per exonNum and tissueSite basis, also 
        computes 'other' field for use in tissueRanking
        @param exonExpr: {
            ..., exonNum: {
               ..., tissueSite: [ ...reads ] 
            }
        } 

        @rType {
            ..., exonNum: {
                ..., tissueSite: {
                    reads: [ ...int ],
                    median: int,
                    over: boolean,
                    other: [ ...otherTissueSite ]: 
                        if over is True, 
                        -- then other holds otherTissueSite for this exonNum
                        -- such that exonExpr[exonNum][otherTissueSite][over] is also True
                        otherwise
                        -- other is empty
                }
            }
        }
    """

    for exonNum, exon in exonExpr.copy().items():
        for tissueSite, reads in exon.copy().items():
            exonExpr[exonNum][tissueSite] = getSumStat(reads, threshold)

    for exonNum, exon in exonExpr.copy().items():
        for tissueSite, sumStat in exon.copy().items():
            exonExpr[exonNum][tissueSite]["other"] = []

            if "over" in sumStat and sumStat["over"] is False:
                continue

            for otherTissueSite, otherSumStat in exon.copy().items():
                if otherSumStat["over"] is True:
                    exonExpr[exonNum][tissueSite]["other"].append(
                        otherTissueSite)


def getTissueRanking(exonExpr):
    """ Computes tissueRanking based on input exonExpr 
        @rType tissueRanking: {
            refTissueSite: {
                ..., rankedTissueSite: {
                    exons: [ ..., exonNum ],
                        If refTissueSite != rankedTissueSIte 
                        -- exonNum is such that exonExpr[exonNum][refTissueSite][other].includes(rankedTissueSite) == True
                        else 
                        -- exonNum is such that exonExpr[exonNum][refTissueSite][over] == True
                    exonNumLen: int,       # length of tissueRanking[refTissueSite][rankedTissueSite]
                }
            } 
        } 
    """

    tissueRanking = {}

    for exonNum, exon in exonExpr.copy().items():
        for tissueSite, sumStat in exon.copy().items():

            for otherTissueSite in sumStat["other"]:

                # first time ... init data structure
                if tissueSite not in tissueRanking:
                    tissueRanking[tissueSite] = {}
                if otherTissueSite not in tissueRanking[tissueSite]:
                    tissueRanking[tissueSite][otherTissueSite] = {}
                    tissueRanking[tissueSite][otherTissueSite]["exons"] = []
                    tissueRanking[tissueSite][otherTissueSite]["exonNumLen"] = 0
                tissueRanking[tissueSite][otherTissueSite]["exons"].append(
                    exonNum)
                tissueRanking[tissueSite][otherTissueSite]["exonNumLen"] += 1

    return tissueRanking


def rankOneGene(ensembl_id, threshold):
    """ Generate ranking statistics for exonExpr of one gene
        based on the given threshold
        The output file have ext of `.threshold` 

        SideEffect: output file written to disk

        @param str ensembl_id: 
            str infp: path to data of one gene in exon_expr/, suffixed by .ext
            str outfp: output path, suffixed by .threshold
        @param int threshold: cutoff to determine if an exon is expressed in sufficient amount
        @rType str: report for logging
    """

    gp = get_exonexpr_storepath(ensembl_id)
    infp = gp + "." + EXT_INC
    outfp = gp + '.' + str(threshold)

    with open(infp, "r") as inf:
        with open(outfp, 'w+') as outf:
            exonExpr = json.loads(inf.read())
            addSumStat(exonExpr, threshold)

            out = {}
            out["exonExpression"] = exonExpr
            out["tissueRanking"] = getTissueRanking(exonExpr)

            json.dump(out, outf)

    return "Generating ranking for {}".format(gp)


def computeGeneLevelRanking(threshold):
    """ Process files under exon_expr/
        and generate tissueRanking for each 

        @param threshold: int
    """

    for root, files in traverse_resources_dir(OPTION_EXONEXPR):
        for f in files:

            ensembl_id, ext = os.path.splitext(f)
            assert (isEnsemblId(ensembl_id)), "invalid ensembl id {}".format(ensembl_id)

            # use data, which includes experimental data, for calculating ranking
            if ext == "." + EXT_INC:
                print("Generate ranking {}".format(ensembl_id))
                rankOneGene(ensembl_id, threshold)



def rankOnePanel(gps):
    """ Generate ranking for a gene panel 
        precondition: each gene in the panel has tissueRanking generated

        SideEffect: output file written to disk

        @param [ ..., gp ] gps: a list of path under exon_expr/ for panel genes
        @rType dict panelRankingSorted

        # intermediate
        panelRanking: {
            ..., refTissueSite: {
                ..., rankedTissueSite: {

                    # exonNumLenList <- <gene>[tissueRanking][refTissueSite][rankedTissueSite][exonNumLen]
                    exonNumLen,             # summation of exonNumLenList for all genes in gps
                    fractions: [],          
                }
            }
        }

        # Later sort panelRanking by 
        -- 1. mean of fractions, descending
        -- 2. exonNumLen, descending
        -- 3. rankedTissueSite, alphabetically
        panelRankingSorted: {
            ..., refTissueSite: [
                ..., [ rankedTissueSite, exonNumLen, fractions ]
            ]
        }
    """
    # initialize data structure
    panelRanking = {}
    for tissueSite in TISSUE_SITES:
        panelRanking[tissueSite] = {}
        for tissueSiteInner in TISSUE_SITES:
            panelRanking[tissueSite][tissueSiteInner] = {}
            panelRanking[tissueSite][tissueSiteInner]["exonNumLen"] = 0
            panelRanking[tissueSite][tissueSiteInner]["fractions"] = []

    # process each gene at a time
    for gp in gps:
        with open(gp, 'r') as f:
            geneRanking = json.loads(f.read())["tissueRanking"]

            for refK, refV in geneRanking.items():

                # Proceeds only if tissueRanking[tissueSite][tissueSite] exists
                # which holds exons over threshold for tissueSite itself
                # otherwise skip this tissueSite, as the exon_expr for
                # refTissueSite not over threshold for this gene
                if refK in refV:

                    # total cannot be 0, since refK is in refV implies
                    # at least one exonNum added to list
                    # -- 1. geneRanking[reftissueSite][rankedTissueSite][exonNumLen] > 0
                    # -- 2. geneRanking[reftissueSite][rankedTissueSite][exons] not empty
                    total = refV[refK]["exonNumLen"]
                    assert total != 0

                    considered = []
                    for rankedK, rankedV in refV.items():
                        fraction = rankedV["exonNumLen"] / total
                        panelRanking[refK][rankedK]["exonNumLen"] += rankedV["exonNumLen"]
                        panelRanking[refK][rankedK]["fractions"].append(
                            fraction)
                        considered.append(rankedK)

                    # Here
                    # -- refTissueSite has some exon expressed over threshold
                    # -- there may be some tissueSite not ranked in geneRanking because none of exons
                    # ---- in refTissueSite expresses are expressed over threshold in such tissueSite
                    # -- should
                    # ---- 1. append fraction = 0 to list of fractions in this case
                    for tissueSite in TISSUE_SITES:
                        if tissueSite not in considered:
                            panelRanking[refK][tissueSite]["fractions"].append(
                                0)

    # convert rankedTissueSite from dict to list
    panelRankingSorted = {}
    for tissueSite in TISSUE_SITES:
        panelRankingSorted[tissueSite] = []

    for refK, refV in panelRanking.items():
        for rankedK, rankedV in refV.items():

            meanFrac = 0
            medianFrac = 0

            if rankedV["fractions"]:
                rankedV["fractions"].sort()
                meanFrac = np.mean(rankedV["fractions"])
                medianFrac = np.percentile(rankedV["fractions"], 50)

            panelRankingSorted[refK].append(
                [rankedK, rankedV["exonNumLen"], medianFrac, meanFrac])

    # sort panelRankingSorted
    for refK, refV in panelRankingSorted.items():
        refV.sort(key=lambda x: (x[2], x[1], x[0]), reverse=True)

    return panelRankingSorted


def computePanelLevelRanking(threshold):
    """ Process all available gene panels, 
        generate and store <panel>.ranking for each 
        under /gene_panels/ranking

        @param threshold: int
    """

    for panel in GENE_PANELS:

        print("ComputePanelLevelRanking:: {}\n".format(panel)) 

        gps = []
        for gene in PANEL_REF[panel]:
            storepath = get_exonexpr_storepath(gene["ensembl_id"])
            if storepath:
                gps.append(storepath + "." + str(threshold))
            else:
                print("---- {} missing\n".format(gene["ensembl_id"]))

        ranking = rankOnePanel(gps)

        outp = os.path.join(
            app.config["GENE_PANEL_RANKING_DIR"], panel + ".ranking." + str(threshold))
        with open(outp, "w+") as outf:
            json.dump(ranking, outf)




def computeRanking(option, threshold, ensembl_id):
    """ Dispatch correct ranking methods given option
    
        @param option enum
        @param threshold int
        @param ensembl_id str
    """

    assert (isinstance(threshold, int) and threshold >= 0), "invalid threshold"

    if option == OPTION_RANKING_GENE:
        rankOneGene(ensembl_id, threshold)
    elif option == OPTION_RANKING_ALL_GENE:
        computeGeneLevelRanking(threshold)
    elif option == OPTION_RANKING_ALL_GENEPANEL:
        computePanelLevelRanking(threshold)
    else:
        return
        


