import { geneEntity, genePanelEntity, stateInterface } from "../Interfaces";
import { isEmptyObject } from "../utils/Utils";

export function getGeneEntityById(
  genes: geneEntity[],
  ensemblId: string
): geneEntity {
  let result = getGeneEntityByIdList(genes, [ensemblId]);
  return result.length == 1 ? result[0] : {} as geneEntity;
}

export function getGeneEntityByIdList(
  genes: geneEntity[],
  ensemblIds: string[]
): geneEntity[] {
  let filtered = genes.filter(gene => {
    return ensemblIds.includes(gene.ensemblId);
  });
  return filtered || ([] as geneEntity[]);
}

export function getGenePanelEntityById(
  genePanel: genePanelEntity[],
  genePanelIds: string
): genePanelEntity {
  let result = getGenePanelEntityByIdList(genePanel, [genePanelIds]);
  return result.length == 1 ? result[0] : {} as genePanelEntity;
}

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
    return panel.tissueRanking[tissueSite]["ranking"];
  } else {
    return [];
  }
}
