import { geneEntity, genePanelEntity } from "../Interfaces";
import { isEmptyObject, isNonEmptyArray } from "../utils/Utils";

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
  Converts an array of ensemblIds to an array of corresponding geneSymbol
*/
export function ensemblIdsToGeneSymbolList(
  genes: geneEntity[],
  ensemblIds: string[]
): string[] {
  let geneEntities = getGeneEntityByIdList(genes, ensemblIds);
  return geneEntities
    .filter((gene: geneEntity) => gene["geneSymbol"] !== "")
    .map((gene: geneEntity) => gene["geneSymbol"]);
}

/* 
  Return true if entities.gene.property is populated previouslly 
  false otherwise 
*/
export function genePropertyPopulated(
  genes: geneEntity[],
  ensemblId: string,
  property: string
): boolean {
  let result = getGeneEntityById(genes, ensemblId);

  return (
    !isEmptyObject(result) &&
    result.hasOwnProperty(property) &&
    !isEmptyObject(result[property])
  );
}

/* 
  Return true if entities.gene.geneSymbol is empty 
  false otherwise 
*/
export function geneSymbolPopulated(
  genes: geneEntity[],
  ensemblId: string
): boolean {
  let result = getGeneEntityById(genes, ensemblId);
  return (
    !isEmptyObject(result) &&
    result.hasOwnProperty("geneSymbol") &&
    result["geneSymbol"] !== ""
  );
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
  Return true if entities.genePanel.panelGenes is populated previously 
  false otherwise 
*/
export function genePanelPanelGenesPopulated(
  genePanels: genePanelEntity[],
  genePanelId: string
): boolean {
  let result = getGenePanelEntityById(genePanels, genePanelId);

  return (
    !isEmptyObject(result) &&
    result.hasOwnProperty("panelGenes") &&
    isNonEmptyArray(result["panelGenes"])
  );
}

export function genePanelTissueRankingPopulated(
  genePanels: genePanelEntity[],
  genePanelId: string
): boolean {
  let result = getGenePanelEntityById(genePanels, genePanelId);
  return (
    !isEmptyObject(result) &&
    result.hasOwnProperty("tissueRanking") &&
    !isEmptyObject(result["tissueRanking"])
  );
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
    console.log(tissueRanking);
    return tissueRanking[refTissueSite][rankedTissueSite];
  } else {
    return {
      exonNumLen: 0,
      exons: []
    };
  }
}

// export function queryTissueRankingsByGeneId(
//   gene: geneEntity[],
//   ensemblId: string,
//   refTissueSite: string,
//   rankedTissueSites: string[]
// ): { exonNumLen: number; exons: string[] } {
//   let tissueRanking = getGeneEntityById(gene, ensemblId)["tissueRanking"];

//   if (
//     tissueRanking.hasOwnProperty(refTissueSite) &&
//     tissueRanking[refTissueSite].hasOwnProperty(rankedTissueSite)
//   ) {
//     return tissueRanking[refTissueSite][rankedTissueSite];
//   } else {
//     return {
//       exonNumLen: 0,
//       exons: []
//     };
//   }
// }
