import "../actions/EntitiesActions";

import {
  EMPTY_SELECTED_GENE,
  SET_GENE_PANEL,
  SET_GENEFORPLOT,
  SET_RANKED_TISSUESITE,
  SET_REF_TISSUESITE,
  SET_SEARCH_COLLAPSE,
  SET_SELECTED_GENE,
  UPDATE_SEARCH_OPTIONS
} from "../actions/UIActions";

function select(state, action) {
  switch (action.type) {
    case SET_SELECTED_GENE:
      return { ...state, gene: [...action.ensemblIds] };
    case EMPTY_SELECTED_GENE:
      return { ...state, gene: [] };
    case SET_GENEFORPLOT:
      return { ...state, geneForPlot: action.ensemblId };
    case SET_GENE_PANEL:
      return { ...state, genePanel: action.genePanelId };
    case SET_REF_TISSUESITE:
      return { ...state, refTissueSite: action.tissueSiteId };
    case SET_RANKED_TISSUESITE:
      return { ...state, rankedTissueSite: action.tissueSiteId };
    default:
      return state;
  }
}

function search(state, action) {
  switch (action.type) {
    case UPDATE_SEARCH_OPTIONS:
      return { ...state, selectedOptions: [...action.options] };
    case SET_SEARCH_COLLAPSE:
      return { ...state, collapse: action.collapse };

    default:
      return state;
  }
}

export default function ui(state, action) {
  switch (action.type) {
    case SET_SELECTED_GENE:
    case EMPTY_SELECTED_GENE:
    case SET_GENEFORPLOT:
    case SET_GENE_PANEL:
    case SET_REF_TISSUESITE:
    case SET_RANKED_TISSUESITE:
      return { ...state, select: select(state.select, action) };
    case UPDATE_SEARCH_OPTIONS:
    case SET_SEARCH_COLLAPSE:
      return { ...state, search: search(state.search, action) };
    default:
      return state;
  }
}
