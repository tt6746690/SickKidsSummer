import os
import json
from re import match

import scipy.stats
import numpy as np

from sickkidsproj import app, db
from sickkidsproj.cache.g import ONE_EXONEXPR, TISSUE_SITES, GENE_PANELS, PANEL_REF
from sickkidsproj.database.query import get_exonexpr_storepath

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
                    exonExpr[exonNum][tissueSite]["other"].append(otherTissueSite)


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
    for tissueSite in TISSUE_SITES:
        tissueRanking[tissueSite] = {}

    # Populate total and sub first
    for exonNum, exon in exonExpr.copy().items():
        for tissueSite, sumStat in exon.copy().items():

            for otherTissueSite in sumStat["other"]:
                if otherTissueSite not in tissueRanking[tissueSite]:
                    tissueRanking[tissueSite][otherTissueSite] = {}
                    tissueRanking[tissueSite][otherTissueSite]["exons"] = []
                    tissueRanking[tissueSite][otherTissueSite]["exonNumLen"] = 0
                tissueRanking[tissueSite][otherTissueSite]["exons"].append(exonNum)
                tissueRanking[tissueSite][otherTissueSite]["exonNumLen"] += 1

    return tissueRanking

def rankOneGene(gp, threshold):
    """ Generate ranking statistics for exonExpr of one gene
        based on the given threshold
        The output file have ext of `.threshold` 

        SideEffect: output file written to disk

        @param str gp: path to data of one gene in exon_expr/ 
            str gpp: output path 
        @param int threshold: cutoff to determine if an exon is expressed in sufficient amount
        @rType str: report for logging
    """

    with open(gp, "r") as inf:
        gpp = gp + '.' + str(threshold)

        with open(gpp, 'w+') as outf:
            exonExpr = json.loads(inf.read())
            addSumStat(exonExpr, threshold)

            out = {}
            out["exonExpression"] = exonExpr
            out["tissueRanking"] = getTissueRanking(exonExpr)

            json.dump(out, outf)

    return "Generating ranking for {}".format(gp)

def computeGeneLevelRanking():
    """ Process files under exon_expr/
        and generate tissueRanking for each 

        @rType str report: logging 
    """
    report = []

    firsttime = True
    for root, dirs, files in os.walk(app.config["EXON_EXPR_DIR"], topdown=True):

        if firsttime:
            firsttime = False
            continue

        for f in files:
            # exclude the generated `.20` files
            # only the raw files are included
            if match('^ENSG[\d]{11}$', f):
                gp = os.path.join(root, f)
                report.append(rankOneGene(gp, 20))

    return report



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
                if refK in refV:

                    # total cannot be 0, since refK is in refV implies 
                    # at least one exonNum added to list
                    total = refV[refK]["exonNumLen"]
                    assert total != 0   

                    for rankedK, rankedV in refV.items():
                        fraction = rankedV["exonNumLen"] / total
                        panelRanking[refK][rankedK]["exonNumLen"] += rankedV["exonNumLen"]
                        panelRanking[refK][rankedK]["fractions"].append(fraction)

    # convert rankedTissueSite from dict to list 
    panelRankingSorted = {}
    for tissueSite in TISSUE_SITES:
        panelRankingSorted[tissueSite] = []

    for refK, refV in panelRanking.items():
        for rankedK, rankedV in refV.items():
            panelRankingSorted[refK].append([rankedK, rankedV["exonNumLen"], np.mean(rankedV["fractions"]) if rankedV["fractions"] else 0])

    # sort panelRankingSorted
    for refK, refV in panelRankingSorted.items():
        refV.sort(key=lambda x: (x[2], x[1], x[0]), reverse=True)  

    return panelRankingSorted



def computePanelLevelRanking():
    """ Process all available gene panels, 
        generate and store <panel>.ranking for each 
        under /gene_panels/ranking

        @rType str report: logging 
    """
    report = ""

    for panel in GENE_PANELS:

        report += "ComputePanelLevelRanking:: {}\n".format(panel)

        gps = []
        for gene in PANEL_REF[panel]:
            storepath = get_exonexpr_storepath(gene["ensembl_id"])
            if storepath:
                gps.append(storepath)
            else:
                report += "---- {} missing\n".format(gene["ensembl_id"])

        ranking = rankOnePanel(gps) 

        outp = os.path.join(app.config["GENE_PANEL_RANKING_DIR"], panel + ".ranking.new")
        with open(outp, "w+") as outf:
            json.dump(ranking, outf)


    return report









