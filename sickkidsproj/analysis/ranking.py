import os
import json
from re import match

import scipy.stats
import numpy as np

from sickkidsproj import app, db
from sickkidsproj.cache.g import ONE_EXONEXPR, TISSUE_SITES, GENE_PANEL_PATHS, PANEL_REF

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
        @param str gp: path to reads of one gene in exon_expr/ 
            str gpp: output path 
        @param int threshold: cutoff to determine if an exon is expressed in sufficient amount
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



def rankOnePanel(pp):
    """ Generate ranking for a gene panel 
        precondition: each gene in the panel has tissueRanking generated

        @param str pp: gene panel path 
    """
    return "rankOne"


def computePanelLevelRanking():

    for panel in GENE_PANELS:
        return PANEL_REF[panel]








