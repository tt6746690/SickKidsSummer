import numpy as np
import json
import os
import scipy.stats

# WD="/hpf/projects/brudno/wangpeiq/sickkids_summer/"

WD = "../"
RESOURCES = WD + "resources/"
STORE = WD + "resources/exon_expr/"
PANELDIR = WD + "resources/gene_panels/"

EXONEXPR_MAPPING = WD + "resources/exon_expr.mapping"
ONE_EXONEXPR = STORE + "85/ENSG00000163380"

GENE_PANEL_DIR = WD + "resources/gene_panels/"
GENE_PANEL = ["congenital_myopathy", "congenital_myopathy_dystrophy", "congenital_myasthenic_myopathies"]
GENE_PANEL_PATH = [GENE_PANEL_DIR + gp for gp in GENE_PANEL]

TISSUE_SITE_LIST = STORE + "tissue_site_list"

THRESHOLD = 20
SIGNIFICANCE_LEVEL = 0.05


# Bidirectional hash table 
ref = {}
ref_rev = {}

with open(TISSUE_SITE_LIST, "r") as f:
    idx = 0
    for ts in f.read().split('\n'):
        ref[ts] = idx 
        ref_rev[idx] = ts
        idx += 1
        
def ts_to_id(ts):
    return ref[ts]
def id_to_ts(id):
    return ref_rev[id]


def computeSumStat(l):
    lsorted = sorted(l)
    sumStat = {}
    
    sumStat["reads"] = lsorted
    sumStat["median"] = np.percentile(lsorted, 50) 
    sumStat["mean"] = np.mean(lsorted) 
    sumStat["ttest_1samp"] = scipy.stats.ttest_1samp(lsorted, THRESHOLD)
    sumStat["overByMedian"] = True if (sumStat["median"] > THRESHOLD) else False
    sumStat["overByMean"] = True if (sumStat["mean"] > THRESHOLD) else False
    sumStat["overByTtest"] = True if (sumStat["ttest_1samp"][0] > 0 and 
                                      sumStat["ttest_1samp"][1]/2 <= SIGNIFICANCE_LEVEL) else False
    return sumStat



def prelimRanking(input):
    data = input["exonExpression"]
    exonexpr = input["exonExpression"]
    
    for exonNum in exonexpr:
        exon = exonexpr[exonNum]
        for tissueSite in exon:
            d = exon[tissueSite] 
            
            # Determine the basis for computing tissue Ranking
            # If exon reads for this exonNum and tissueSite 
            # -- is over threshold, 
            # ---- then d["otherTissue"] holds tissue names that is also over threshold
            # -- is not over threshold
            # ---- then d["otherTissue"] is empty
            # 
            d["otherTissue"] = []
            if d["overByTtest"]:
                for ts in exon:
                    other = exon[ts]
                    if other["overByTtest"]:
                        d["otherTissue"].append(ts_to_id(ts))
            d["otherTissue"].sort()
    
    '''
    tissueRanking: {
        ..., referenceTissueSite:{
            total: [ ..., exonNum ],
            sub: { ...,
                rankedTissueSite: [ ..., exonNum ]
            },
            ranking: [ ..., [rankedTissueSite, sub, fraction] ]
        }
    }
    indexed by id converted by ts_to_id, 
    and sorted by sub/total ratio in descending order
    -- total: exon in referenceTissueSite over threshold
    -- sub: by tissueSite, exonNum that is also over threshold 
    ---- given that exonNum in referenceTissueSite is over threshold
    -- ranking: a list of rankedTissueSite sorted in descending order 
    ---- w.r.t. len(rankedTissuSite) / len(total)
    
    '''
    # init dictionary 
    tissueRanking = {}
    for k in ref:
        tissueRanking[k] = {}
        tissueRanking[k]["total"] = []
        tissueRanking[k]["sub"] = {}
        
    # populate total and sub
    for exonNum in exonexpr:
        exon = exonexpr[exonNum]
        for tissueSite in exon:
            d = exon[tissueSite]
             
            refTissueSite = tissueRanking[tissueSite]
            if d["overByTtest"]:
                refTissueSite["total"].append(exonNum)
            
            for otherts in d["otherTissue"]:
                if id_to_ts(otherts) not in refTissueSite["sub"]:
                    refTissueSite["sub"][id_to_ts(otherts)] = []
                refTissueSite["sub"][id_to_ts(otherts)].append(exonNum) 
                
    # Generate ranking 
    for refk in ref:
        
        ranking = []
        refTissueSite = tissueRanking[refk]
        
        total = len(refTissueSite["total"])
        for rankk in refTissueSite["sub"]:
            rankedTissueSite = refTissueSite["sub"][rankk]
            t = [rankk, len(rankedTissueSite), len(rankedTissueSite)/total]
            ranking.append(t)
        
        ranking.sort(key=lambda x: x[1], reverse=True)
        tissueRanking[refk]["ranking"] = ranking

    data = {}
    data["tissueRanking"] = tissueRanking
    data["exonExpression"] = exonexpr
    return data
      
        
def processOne(gp):
    
    print("Processing {}...".format(gp))
     
    exonexpr = {}
    with open(gp, "r") as f:
        exonexpr = json.loads(f.read())
        
    if "exon_expression" not in exonexpr:
           
        withRanking = prelimRanking(exonexpr)
        with open(gp, "w") as f:
            json.dump(withRanking, f)
        print("Compute ranking {}...".format(gp))    
        return 
    
    
    # compute summary statistis
    data = {}
    for exonNum in exonexpr["exon_expression"]:

        data[exonNum] = {}
        exon = exonexpr["exon_expression"][exonNum]
        for tissueSite in exon:
            reads = exon[tissueSite]    
            sumStat = computeSumStat(reads)

            data[exonNum][tissueSite] = sumStat
    
    with open(gp, "w") as f:
        json.dump(data, f)
        



# gene-level ranking, done
#  firsttime=True
#  for root, dirs, files in os.walk(STORE, topdown=True):
#      if firsttime:
#          firsttime=False
#          continue
#
#      for f in files:
#          gp = os.path.join(root, f)
#          processOne(gp)
    
    

# get mapping 
mapping = {}
with open(EXONEXPR_MAPPING, "r") as f:
    for g in f.read().split('\n'):
        pair = g.split('\t')
        if len(pair) == 2:
            mapping[pair[0]] = pair[1]


def computeRankingForPanel(gp):
    '''
    panelRanking: {
            ..., referenceTissueSite:{
                total: int,
                ranking: {
                    ..., rankedTIssueSite: {
                        sub,           ## total 
                        fraction: []   ## for each
                    }
                }                      ## later converted to [rankingTissueSite, sub, medianFraction]
            }
        }

    '''


    panelRanking = {}

    for k in ref:
        panelRanking[k] = {}
        panelRanking[k]["total"] = 0
        panelRanking[k]["ranking"] = {}
        for kk in ref:
            panelRanking[k]["ranking"][kk] = {}
            panelRanking[k]["ranking"][kk]["sub"] = 0
            panelRanking[k]["ranking"][kk]["fraction"] = []


    for path in gp:
        with open(path, "r") as f:
            g = json.loads(f.read())
            rankingForGene = g["tissueRanking"]
            for refTissueSite in rankingForGene:

                refTissueRanking = rankingForGene[refTissueSite]

                panelRanking[refTissueSite]["total"] += len(refTissueRanking["total"])
                for truple in refTissueRanking["ranking"]:
                    rankedTissueSite = truple[0]
                    numOfExon = truple[1]
                    frac = truple[2]
                    panelRanking[refTissueSite]["ranking"][rankedTissueSite]["sub"] += numOfExon
                    panelRanking[refTissueSite]["ranking"][rankedTissueSite]["fraction"].append(frac)

    # convert dict to list and sort the ranking list
    for refTissue in panelRanking: 
        rankingList = []
        refRanking = panelRanking[refTissue]["ranking"]
        for rankedTissue in refRanking:
            refRanking[rankedTissue]["fraction"].sort(reverse=True)

            sub = refRanking[rankedTissue]["sub"]
            medianFraction = np.percentile(refRanking[rankedTissue]["fraction"], 50) \
                if refRanking[rankedTissue]["fraction"] else 0
            rankingList.append([rankedTissue, sub, medianFraction])

        del panelRanking[refTissue]["ranking"]
        rankingList.sort(key=lambda x: x[2], reverse=True)      # sort by medianFraction
        panelRanking[refTissue]["ranking"] = rankingList
        
    return panelRanking

def ComputeRankingForAllPanel():
    
    for gpp in GENE_PANEL_PATH:
        
        # Get a list of path for genes in panel
        gp = []
        with open(gpp, "r") as f:
            for g in f.read().split('\n'):
                if len(g.split('\t')) == 2:
                    ensemblId = g.split('\t')[1]
                    if ensemblId in mapping:
                        gp.append(RESOURCES + mapping[ensemblId])
        
        print("compute ranking for {}...".format(gpp))
        ranking = computeRankingForPanel(gp)
        
        with open(gpp + ".ranking", "w+") as outf:
            json.dump(ranking, outf)


ComputeRankingForAllPanel()



