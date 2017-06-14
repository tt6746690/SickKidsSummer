import {
  geneEntity,
  genePanelEntity,
  tissueSiteEntity,
  stateInterface
} from "../Interfaces";

// actionTypes

// entity
export const ADD_GENE = "ADD_GENE";
export const ADD_GENE_PANEL = "ADD_GENE_PANEL";
export const ADD_TISSUE_SITE = "ADD_TISSUE_SITE";

// ui
export const SELECT_GENE_PANEL = "SELECT_GENE_PANEL";
export const SELECT_REF_TISSUE_SITE = "SELECT_REF_TISSUE_SITE";

export const TOGGLE_GENE = "TOGGLE_GENE";
export const TOGGLE_TISSUE_SITE = "TOGGLE_TISSUE_SITE";

// display plots
export const SET_PLOT_DISPLAY = "SET_PLOT_DISPLAY";
export const PLOT_DISPLAY_TYPE = {
  GENE_EXPR_PLOT: "GENE_EXPR_PLOT",
  EXON_EXPR_PLOT: "EXON_EXPR_PLOT"
};

export function setPlotDisplay(
  plotDisplayType = PLOT_DISPLAY_TYPE.GENE_EXPR_PLOT
) {
  return {
    type: SET_PLOT_DISPLAY,
    plotDisplayType
  };
}

// actionCreators
export function addGene({
  ensemblId,
  geneSymbol = "",
  geneExpr = {},
  exonExpr = {}
}: geneEntity) {
  return {
    type: ADD_GENE,
    ensemblId,
    geneSymbol,
    geneExpr,
    exonExpr
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
