import {
  geneEntity,
  genePanelEntity,
  tissueSiteEntity,
  stateInterface,
  searchIndexEntity,
  OPTION_TYPE
} from "../Interfaces";

// actionTypes

// entity
export const ADD_GENE = "ADD_GENE";
export const ADD_GENE_PANEL = "ADD_GENE_PANEL";
export const ADD_TISSUE_SITE = "ADD_TISSUE_SITE";

export const LOAD_SEARCH_INDEX = "LOAD_SEARCH_INDEX";

// ui.select
export const SELECT_GENE_PANEL = "SELECT_GENE_PANEL";
export const SELECT_REF_TISSUE_SITE = "SELECT_REF_TISSUE_SITE";

export const TOGGLE_GENE = "TOGGLE_GENE";
export const TOGGLE_TISSUE_SITE = "TOGGLE_TISSUE_SITE";

export const CLEAR_GENE_SELECTION = "CLEAR_GENE_PANEL_SELECTION";
export const CLEAR_TISSUE_SITE_SELECTION = "CLEAR_TISSUE_SITE_SELECTION";

// ui.include
export const UPDATE_INCLUDE_GENE = "UPDATE_INCLUDE_GENE";

// ui.viewType
export const SELECT_VIEW = "SELECT_VIEW";
export const VIEW_TYPE = {
  GENE_EXPR_PLOT: "GENE_EXPR_PLOT",
  EXON_EXPR_PLOT: "EXON_EXPR_PLOT",
  TISSUESITE_RANKING: "TISSUESITE_RANKING"
};

export function updateIncludeGene(options: searchIndexEntity[]) {
  return {
    type: UPDATE_INCLUDE_GENE,
    gene: options.reduce((acc, cur) => {
      if (cur.type === OPTION_TYPE.GENE_TYPE) {
        return acc.concat(cur.ensemblId);
      } else if (cur.type === OPTION_TYPE.PANEL_TYPE) {
        return acc.concat(cur.panelGenes);
      }
    }, [])
  };
}

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

export function addTissueSite({ tissueSiteId }: tissueSiteEntity) {
  return {
    type: ADD_TISSUE_SITE,
    tissueSiteId
  };
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

export function selectGenePanel(genePanelId: string) {
  return {
    type: SELECT_GENE_PANEL,
    genePanelId
  };
}

export function selectRefTissueSite(tissueSiteId: string) {
  return { type: SELECT_REF_TISSUE_SITE, tissueSiteId };
}

export function toggleGene(ensemblId: string) {
  return {
    type: TOGGLE_GENE,
    ensemblId
  };
}

export function toggleTissueSite(tissueSite: string) {
  return {
    type: TOGGLE_TISSUE_SITE,
    tissueSite
  };
}

export function clearGeneSelection() {
  return { type: CLEAR_GENE_SELECTION };
}

export function clearTissueSiteSelection() {
  return { type: CLEAR_TISSUE_SITE_SELECTION };
}

export function setViewType(viewType = VIEW_TYPE.TISSUESITE_RANKING) {
  return { type: SELECT_VIEW, viewType };
}
