import { genePanelEntity, OPTION_TYPE, searchIndexEntity } from "../Interfaces";
import entities from "../reducers/Entities";
import { getGeneEntityById, getGenePanelEntityById } from "../store/Query";
import {
  flattenPanelOptionPanelGenes,
  getOptionByType,
  makeGeneOption
} from "../utils/Option";
import { isEmptyObject } from "../utils/Utils";
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