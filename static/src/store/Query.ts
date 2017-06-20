import {
  geneEntity,
  genePanelEntity,
  tissueSiteEntity,
  stateInterface
} from "../Interfaces";
import { isEmptyObject } from "../utils/Utils";

/*
  Queries entities.gene and 
  returns an array of geneEntity given a single ensemblId 
*/
export function getGeneEntityById(
  genes: geneEntity[],
  ensemblId: string
): geneEntity {
  let result = getGeneEntityByIdList(genes, [ensemblId]);
  return result.length == 1 ? result[0] : {} as geneEntity;
}

/*
  Queries entities.gene and 
  returns an array of geneEntity given an array of ensemblId
*/
export function getGeneEntityByIdList(
  genes: geneEntity[],
  ensemblIds: string[]
): geneEntity[] {
  let filtered = genes.filter(gene => {
    return ensemblIds.includes(gene.ensemblId);
  });
  return filtered || ([] as geneEntity[]);
}

/*
  Queries entities.genePanel and 
  returns an array of genePanelEntity given a single panel Id
*/
export function getGenePanelEntityById(
  genePanel: genePanelEntity[],
  genePanelIds: string
): genePanelEntity {
  let result = getGenePanelEntityByIdList(genePanel, [genePanelIds]);
  return result.length == 1 ? result[0] : {} as genePanelEntity;
}

/*
  Queries entities.genePanel and 
  returns an array of genePanelEntity given an array of panel Id 
*/
export function getGenePanelEntityByIdList(
  genePanel: genePanelEntity[],
  genePanelIds: string[]
): genePanelEntity[] {
  let filtered = genePanel.filter(panel => {
    return genePanelIds.includes(panel.genePanelId);
  });
  return filtered || ([] as genePanelEntity[]);
}

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
  tissueSite: string
): Object[] {
  let panel = getGenePanelEntityById(genePanel, genePanelId);

  if ("tissueRanking" in panel && tissueSite in panel.tissueRanking) {
    return panel.tissueRanking[tissueSite];
  } else {
    return [];
  }
}

/*
  Queries gene and returns a subset such that either
  -- exonExpr
  -- geneExpr
  is not populated from server
*/
export function getIncompleteGeneEntity(gene: geneEntity[]): geneEntity[] {
  return gene.filter(g => {
    return isEmptyObject(g.exonExpr) || isEmptyObject(g.geneExpr);
  });
}

/* Queries entities.gene.tissueRanking 
  Return the corresponding exonNumLen and exons that are over threshold 
  with given refTissueSite and rankedTissueSite
*/
export function queryTissueRankingByGeneId(
  gene: geneEntity[],
  ensemblId: string,
  refTissueSite: string,
  rankedTissueSite: string
): { exonNumLen: number; exons: string[] } {
  let tissueRanking = getGeneEntityById(gene, ensemblId)["tissueRanking"];

  if (
    tissueRanking.hasOwnProperty(refTissueSite) &&
    tissueRanking[refTissueSite].hasOwnProperty(rankedTissueSite)
  ) {
    return tissueRanking[refTissueSite][rankedTissueSite];
  } else {
    return {
      exonNumLen: 0,
      exons: []
    };
  }
}
