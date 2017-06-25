import {
  geneEntity,
  genePanelEntity,
  OPTION_TYPE,
  searchIndexEntity,
  tissueSiteEntity
} from "../Interfaces";
import { getGeneEntityById, getGenePanelEntityById } from "../store/Query";
import {
  flattenPanelOptionPanelGenes,
  getOptionByType,
  makeGeneOption
} from "../utils/Option";
import { isEmptyObject } from "../utils/Utils";

// actionTypes
export const HYDRATE_INITIAL_STATE = "HYDRATE_INITIAL_STATE";

// entity
export const ADD_GENE = "ADD_GENE";
export const ADD_GENE_PANEL = "ADD_GENE_PANEL";
export const ADD_TISSUE_SITE = "ADD_TISSUE_SITE";

export const LOAD_SEARCH_INDEX = "LOAD_SEARCH_INDEX";

// ui.select
export const SELECT_GENE_PANEL = "SELECT_GENE_PANEL";
export const SELECT_REF_TISSUE_SITE = "SELECT_REF_TISSUE_SITE";

export const TOGGLE_GENE = "TOGGLE_GENE";
export const UPDATE_GENE = "UPDATE_GENE";
export const TOGGLE_TISSUE_SITE = "TOGGLE_TISSUE_SITE";

export const CLEAR_GENE_SELECTION = "CLEAR_GENE_PANEL_SELECTION";
export const CLEAR_TISSUE_SITE_SELECTION = "CLEAR_TISSUE_SITE_SELECTION";

// ui.search
export const UPDATE_SEARCH_OPTIONS = "UPDATE_SEARCH_OPTIONS";
export const SET_SEARCH_COLLAPSE = "SET_SEARCH_COLLAPSE";

// ui.viewType
export const SELECT_VIEW = "SELECT_VIEW";
export const VIEW_TYPE = {
  GENE_EXPR_PLOT: "GENE_EXPR_PLOT",
  EXON_EXPR_PLOT: "EXON_EXPR_PLOT",
  TISSUESITE_RANKING: "TISSUESITE_RANKING"
};

/* 
  Given searchOptions, 
  -- update ui.select.genes considering that option can be of GENE_TYPE and PANEL_TYPE
  -- queries entities.genePanel.panelGenes to expand PANEL_TYPE options
  ---- this is necessary since during onSearchChange panelGenes is yet to be fetched
*/
export function updateSelectedGeneWithOptions(options: searchIndexEntity[]) {
  return (dispatch, getState) => {
    let { entities: { genePanel } } = getState();

    let ensemblId;
    let geneOptions = getOptionByType(options, OPTION_TYPE.GENE_TYPE);
    let panelOptions = getOptionByType(options, OPTION_TYPE.PANEL_TYPE);

    panelOptions = panelOptions.map(panelOption => {
      let genePanelEntity = getGenePanelEntityById(genePanel, panelOption.name);
      let panelGenes =
        !isEmptyObject(genePanelEntity) && genePanelEntity["panelGenes"];
      return { ...panelOption, panelGenes };
    });

    let allGenes = geneOptions
      .map(opt => opt.ensemblId)
      .concat(flattenPanelOptionPanelGenes(panelOptions));

    return dispatch(updateGene(allGenes));
  };
}

export function updateSearchOptions(options: searchIndexEntity[] = []) {
  return {
    type: UPDATE_SEARCH_OPTIONS,
    options
  };
}

/*
  Updates panelOption with the latest value of entities.genePanel.panelGenes
  Updates ui.search.searchOption depending on value of collapse 
  -- if collapse is true: then panelOption (i.e. OPTION_TYPE.PANEL_TYPE) is collapsed into one
  -- otherwise, panelOption is expanded to its constituent geneOptions
*/
export function updateSearchOptionWithCollapse(
  options: searchIndexEntity[] = []
) {
  return (dispatch, getState) => {
    let {
      entities: { gene, genePanel },
      ui: { search: { collapse } }
    } = getState();

    let geneOptions = getOptionByType(options, OPTION_TYPE.GENE_TYPE);
    let panelOptions = getOptionByType(options, OPTION_TYPE.PANEL_TYPE);

    /*
      update ui.search.searchOption.panelGenes (whose type is PANEL_TYPE)
      with value in entities.genePanel.panelGenes
    */
    panelOptions = panelOptions.map(panelOption => {
      let genePanelEntity = getGenePanelEntityById(genePanel, panelOption.name);

      let panelGenes =
        !isEmptyObject(genePanelEntity) && genePanelEntity["panelGenes"];

      return {
        ...panelOption,
        panelGenes
      };
    });

    /*
      update selectedOption depending on value of collapse
    */
    let selectedOption: searchIndexEntity[] = [];
    geneOptions.forEach(geneOption => selectedOption.push(geneOption));
    if (collapse) {
      panelOptions.forEach(panelOption => selectedOption.push(panelOption));
    } else {
      panelOptions.forEach(panelOption => {
        panelOption.panelGenes.forEach(ensemblId => {
          let geneEntity = getGeneEntityById(gene, ensemblId);
          let name = geneEntity && geneEntity.geneSymbol;
          selectedOption.push(makeGeneOption({ name, ensemblId }));
        });
      });
    }

    return dispatch(updateSearchOptions(selectedOption));
  };
}

export function setSearchCollapse(collapse: boolean = false) {
  return {
    type: SET_SEARCH_COLLAPSE,
    collapse
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
export function updateGene(ensemblIds: string[]) {
  return {
    type: UPDATE_GENE,
    ensemblIds
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
