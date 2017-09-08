import {
  geneEntity,
  genePanelEntity,
  searchIndexEntity,
  tissueSiteEntity
} from "../Interfaces";
import { getGeneEntityByIdList, getGenePanelEntityById } from "../store/Query";
import { getGeneSetHash } from "../utils/Hash";
import { computePanelRanking } from "../utils/Ranking";
import { isEmptyObject } from "../utils/Utils";
import { appendNewPanelHistory, setGenePanel } from "./UIActions";

// entity actionTypes
export const ADD_GENE = "ADD_GENE";
export const ADD_GENE_PANEL = "ADD_GENE_PANEL";
export const ADD_TISSUE_SITE = "ADD_TISSUE_SITE";
export const LOAD_SEARCH_INDEX = "LOAD_SEARCH_INDEX";

export function addGene({
  ensemblId,
  geneSymbol = "",
  geneExpr = {},
  exonExpr = {},
  tissueRanking = {}
}: geneEntity) {
  return {
    type: ADD_GENE,
    ensemblId,
    geneSymbol,
    geneExpr,
    exonExpr,
    tissueRanking
  };
}

export function addGenePanel({
  genePanelId,
  panelGenes = [],
  tissueRanking = {}
}: genePanelEntity) {
  return { type: ADD_GENE_PANEL, genePanelId, panelGenes, tissueRanking };
}

export function addTissueSite(tissueSiteList: tissueSiteEntity[]) {
  return { type: ADD_TISSUE_SITE, tissueSiteList };
}

export function loadSearchIndex(index = []) {
  return {
    type: LOAD_SEARCH_INDEX,
    searchIndex: index.map(entry => {
      let option: searchIndexEntity = { ensemblId: entry[0], name: entry[1] };
      return option;
    })
  };
}

/* 
  compute panelRanking and add resultant ranking to entities.genePanel.tissueRanking
*/
export const populatePanelRanking = (genePanelId: string) => {
  return (dispatch, getState) => {
    let {
      ui: { select: { gene: selectedGene } },
      entities: { genePanel, gene, tissueSite }
    } = getState();

    let panelEntity = getGenePanelEntityById(genePanel, genePanelId);

    if (isEmptyObject(panelEntity.tissueRanking)) {
      let { panelGenes } = panelEntity;

      let panelGeneEntities = getGeneEntityByIdList(gene, panelGenes);
      let ranking = computePanelRanking(panelGeneEntities, tissueSite);
      dispatch(addGenePanel({ genePanelId, tissueRanking: ranking }));
    }
  };
};

/* 
  Given an array of genes 
  -- compute <panelHash> for genePanel based on ensemblIds 
  -- make new genePanel on <panelHash> if not exists 
  -- compute panel's tissueRanking and populate entities.genePanel.<panelHash>.tissueRanking

  To be called on ui.select.gene change 
*/
export function updatePanelEntity(ensemblIds: string[]) {
  return dispatch => {
    let genePanelId = getGeneSetHash(ensemblIds);

    return Promise.all([
      dispatch(addGenePanel({ genePanelId, panelGenes: ensemblIds })),
      dispatch(setGenePanel(genePanelId)),
      dispatch(appendNewPanelHistory(genePanelId))
    ]).then(() => dispatch(populatePanelRanking(genePanelId)));
  };
}
