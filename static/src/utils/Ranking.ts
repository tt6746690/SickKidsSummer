import { geneEntity, genePanelEntity, tissueSiteEntity } from "../Interfaces";
import { getGeneEntityByIdList, getGenePanelEntityById } from "../store/Query";
import { isEmptyObject, mean, median } from "./Utils";

/* 
    Generate ranking for a set of gene (i.e. a genePanel)
    precondition: 
    -- for all genes in the set, entities.gene.tissueRanking non-empty
    -- refTissueSite selected 

    @param panelGenes: an array of geneEntity representing the set of genes
    @param refTissueSite: reference tissueSite selected 
*/
export const computePanelRanking = (
  panelGenes: geneEntity[],
  tissueSite: tissueSiteEntity[]
) => {
  let panelRanking = {};
  let tissueSiteIds = tissueSite.map(ts => ts.tissueSiteId);

  /* 
    initializes panelRanking
  */
  tissueSiteIds.forEach(ref => {
    panelRanking[ref] = {};
    tissueSiteIds.forEach(ranked => {
      panelRanking[ref][ranked] = {
        exonNumLen: 0,
        fractions: []
      };
    });
  });

  let geneRanking = panelGenes
    .filter(
      g =>
        g.hasOwnProperty("tissueRanking") && !isEmptyObject(g["tissueRanking"])
    )
    .map(g => g.tissueRanking)
    .forEach(tissueRanking => {
      Object.keys(tissueRanking).forEach(refTissueSite => {
        let refTissueSiteRanking = tissueRanking[refTissueSite];
        /*
          Proceed only if geneRanking[ref][ref] exists 
          since it holds exons over threshold for refTissueSite itself
          -- geneRanking[ref][ref]["exonNumLen"]: holds total number of exons over threshold 
          -- 
        */
        if (refTissueSiteRanking.hasOwnProperty(refTissueSite)) {
          let { exonNumLen: total } = refTissueSiteRanking[refTissueSite];
          console.assert(total !== 0, "exonNumLen is zero");

          let considered = [];
          Object.keys(refTissueSiteRanking).forEach(rankedTissueSite => {
            let rankedTissueSiteRanking =
              refTissueSiteRanking[rankedTissueSite];
            let { exonNumLen: sub } = rankedTissueSiteRanking;

            let fraction = sub / total;

            panelRanking[refTissueSite][rankedTissueSite]["exonNumLen"] += sub;
            panelRanking[refTissueSite][rankedTissueSite]["fractions"].push(
              fraction
            );
            considered.push(rankedTissueSite);
          });

          /* 
            refTissueSite has some exon expressed over threshold
            -- there may be some tissueSite not ranked in geneRanking because 
            -- non of the exons in refTissueSite are expressed over threshold in such tissueSite 
            hence should just append fraction = 0 to list of fractions in this case
          */
          tissueSiteIds.filter(id => !considered.includes(id)).forEach(id => {
            panelRanking[refTissueSite][id]["fractions"].push(0);
          });
        }
      });
    });

  let ranking = {};
  tissueSiteIds.forEach(id => (ranking[id] = []));

  Object.keys(panelRanking).forEach(refTissueSite => {
    Object.keys(panelRanking[refTissueSite]).forEach(rankedTissueSite => {
      let meanFrac = 0;
      let medianFrac = 0;

      let rankedTissueSiteRanking =
        panelRanking[refTissueSite][rankedTissueSite];
      if (rankedTissueSiteRanking.hasOwnProperty("fractions")) {
        rankedTissueSiteRanking["fractions"].sort((a, b) => a - b);
        meanFrac = mean(rankedTissueSiteRanking["fractions"]);
        medianFrac = median(rankedTissueSiteRanking["fractions"]);
      }
      ranking[refTissueSite].push([
        rankedTissueSite,
        rankedTissueSiteRanking["exonNumLen"],
        medianFrac,
        meanFrac
      ]);
    });
  });

  return ranking;
};

/*
  Get the tissueSite ranking given 
  -- entities.genePanel: store to query from
  -- genePanelId: selected gene panel within entities.genePanel
  -- tissueSite: reference tissueSite 
  Return 
  -- genePanel.tissueRanking if found 
  -- [] otherwise
*/
export function getTissueRanking(
  genePanel: genePanelEntity[],
  genePanelId: string,
  refTissueSite: string
): Object[] {
  let panel = getGenePanelEntityById(genePanel, genePanelId);

  if (
    !isEmptyObject(panel.tissueRanking) &&
    panel.tissueRanking.hasOwnProperty(refTissueSite)
  ) {
    return panel.tissueRanking[refTissueSite];
  } else {
    return [];
  }
}
