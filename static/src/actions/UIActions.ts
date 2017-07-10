import { genePanelEntity, OPTION_TYPE, searchIndexEntity } from "../Interfaces";
import entities from "../reducers/Entities";
import { getGeneEntityById, getGenePanelEntityById } from "../store/Query";
import {
  flattenPanelOptionPanelGenes,
  getOptionByType,
  makeGeneOption
} from "../utils/Option";
import { isEmptyObject, isNonEmptyArray } from "../utils/Utils";
import { updatePanelEntity } from "./EntitiesActions";

// ui.select.gene
export const SET_SELECTED_GENE = "SET_SELECTED_GENE";
export const EMPTY_SELECTED_GENE = "EMPTY_SELECTED_GENE";

// ui.select.geneForPlot
export const SET_GENEFORPLOT = "SET_GENEFORPLOT";

// ui.select.genePanel
export const SET_GENE_PANEL = "SET_GENE_PANEL";

// ui.select.{ref,ranked}TissueSite
export const SET_REF_TISSUESITE = "SET_REF_TISSUESITE";
export const SET_RANKED_TISSUESITE = "SET_RANKED_TISSUESITE";

// ui.select.panelHistory
export const APPEND_NEW_PANEL_HISTORY = "APPEND_NEW_PANEL_HISTORY";

// ui.search
export const UPDATE_SEARCH_OPTIONS = "UPDATE_SEARCH_OPTIONS";
export const SET_SEARCH_COLLAPSE = "SET_SEARCH_COLLAPSE";

/* actionCreators */
export function toggleGene(ensemblId: string) {
  return (dispatch, getState) => {
    let { ui: { select: { gene: selectedGene } } } = getState();
    let restOfGene = selectedGene.filter(id => id !== ensemblId);
    dispatch(setSelectedGene(restOfGene));
    return dispatch(updatePanelEntity(restOfGene));
  };
}

export function setSelectedGene(ensemblIds: string[] = []) {
  return { type: SET_SELECTED_GENE, ensemblIds };
}

export function emptySelectedGene() {
  return { type: EMPTY_SELECTED_GENE };
}

/* 
    set functions
    -- re-sets the state if input is empty
*/
export function setGeneForPlot(ensemblId: string = "") {
  return {
    type: SET_GENEFORPLOT,
    ensemblId
  };
}

export function setGenePanel(genePanelId: string = "") {
  return { type: SET_GENE_PANEL, genePanelId };
}

export function setRefTissueSite(tissueSiteId: string = "") {
  return { type: SET_REF_TISSUESITE, tissueSiteId };
}

export function setRankedTissueSite(tissueSiteId: string = "") {
  return { type: SET_RANKED_TISSUESITE, tissueSiteId };
}

export function appendNewPanelHistory(genePanelId: string = "") {
  return { type: APPEND_NEW_PANEL_HISTORY, genePanelId };
}

export function updateSearchOptions(options: searchIndexEntity[] = []) {
  return {
    type: UPDATE_SEARCH_OPTIONS,
    options
  };
}

export function setSearchCollapse(collapse: boolean = false) {
  return {
    type: SET_SEARCH_COLLAPSE,
    collapse
  };
}

export function selectPanelHistory(genePanelId: string) {
  return (dispatch, getState) => {
    let { entities: { genePanel } } = getState();
    let genePanelEntity = getGenePanelEntityById(genePanel, genePanelId);
    let panelGenes =
      !isEmptyObject(genePanelEntity) && genePanelEntity["panelGenes"];

    dispatch(setSelectedGene(panelGenes));
    dispatch(setGenePanel(genePanelId));

    // Note not calling updatePanelEntity here since
    // -- genePanelId already in entities.genePanel, so no need to add to it
    // -- ranking already computed, so no need to recompute ranking
  };
}

/* 
  Queries ui.select.panelHistory for ui.select.genePanel
  selects the previous panelHistory
  if ui.select.genePanel is the first element in panelHistory
  do nothing
*/
export function selectPreviousPanelHistory() {
  return (dispatch, getState) => {
    let {
      ui: { select: { genePanel: selectedGenePanel, panelHistory } }
    } = getState();

    let idx = panelHistory.indexOf(selectedGenePanel);
    if (idx > 0) {
      // found and not the first element
      dispatch(selectPanelHistory(panelHistory[idx - 1]));
    }
  };
}

/* 
  Queries ui.select.panelHistory for ui.select.genePanel
  selects the previous panelHistory
  if ui.select.genePanel is the last element in panelHistory
  do nothing
*/
export function selectNextPanelHistory() {
  return (dispatch, getState) => {
    let {
      ui: { select: { genePanel: selectedGenePanel, panelHistory } }
    } = getState();

    let idx = panelHistory.indexOf(selectedGenePanel);
    if (idx !== -1 && idx !== panelHistory.length) {
      // found and not the last element
      dispatch(selectPanelHistory(panelHistory[idx + 1]));
    }
  };
}

/* 
  Given searchOptions, 
  -- update ui.select.genes considering that option can be of GENE_TYPE and PANEL_TYPE
  ---- queries entities.genePanel.panelGenes to expand PANEL_TYPE options
  ------ this is necessary since during onSearchChange panelGenes is yet to be fetched
  -- update entities.genePanel to reflect currently selected set of genes
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
    dispatch(setSelectedGene(allGenes));

    if (!isNonEmptyArray(allGenes)) {
      return Promise.resolve();
    }

    return dispatch(updatePanelEntity(allGenes));
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
