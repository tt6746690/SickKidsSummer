import {
  SELECT_GENE_PANEL,
  SELECT_REF_TISSUE_SITE,
  TOGGLE_GENE,
  UPDATE_GENE,
  TOGGLE_TISSUE_SITE,
  SELECT_VIEW,
  CLEAR_GENE_SELECTION,
  CLEAR_TISSUE_SITE_SELECTION,
  UPDATE_SEARCH_OPTIONS,
  SET_SEARCH_COLLAPSE
} from "./EntitiesActions";

import {
  geneEntity,
  genePanelEntity,
  tissueSiteEntity,
  stateInterface
} from "../interfaces";

function toggleGeneReducer(state: geneEntity[], action) {
  if (state.includes(action.ensemblId)) {
    return state.filter(ensemblId => {
      return ensemblId !== action.ensemblId;
    });
  } else {
    return [...state, action.ensemblId];
  }
}

function toggleTissueSiteReducer(state: tissueSiteEntity[], action) {
  if (state.includes(action.tissueSite)) {
    return state.filter(tissueSite => {
      return tissueSite !== action.tissueSite;
    });
  } else {
    return [...state, action.tissueSite];
  }
}

function select(state, action) {
  switch (action.type) {
    case SELECT_GENE_PANEL:
      return {
        ...state,
        genePanel: action.genePanelId
      };
    case SELECT_REF_TISSUE_SITE:
      return {
        ...state,
        refTissueSite: action.tissueSiteId
      };
    case TOGGLE_GENE:
      return {
        ...state,
        gene: toggleGeneReducer(state.gene, action)
      };
    case UPDATE_GENE:
      console.log({ where: "updateGeneReducer", action });
      return {
        ...state,
        gene: [...action.ensemblIds]
      };
    case TOGGLE_TISSUE_SITE:
      return {
        ...state,
        tissueSite: toggleTissueSiteReducer(state.tissueSite, action)
      };
    case CLEAR_GENE_SELECTION:
      return {
        ...state,
        gene: []
      };
    case CLEAR_TISSUE_SITE_SELECTION:
      return {
        ...state,
        tissueSite: []
      };
    default:
      return state;
  }
}

function search(state, action) {
  switch (action.type) {
    case UPDATE_SEARCH_OPTIONS:
      return {
        ...state,
        selectedOptions: [...action.options]
      };
    case SET_SEARCH_COLLAPSE:
      return {
        ...state,
        collapse: action.collapse
      };
    default:
      return state;
  }
}

export default function ui(state, action) {
  switch (action.type) {
    case SELECT_GENE_PANEL:
    case SELECT_REF_TISSUE_SITE:
    case TOGGLE_GENE:
    case UPDATE_GENE:
    case TOGGLE_TISSUE_SITE:
    case CLEAR_GENE_SELECTION:
    case CLEAR_TISSUE_SITE_SELECTION:
      return { ...state, select: select(state.select, action) };
    case SELECT_VIEW:
      return { ...state, viewType: action.viewType };
    case UPDATE_SEARCH_OPTIONS:
    case SET_SEARCH_COLLAPSE:
      return { ...state, search: search(state.search, action) };
    default:
      return state;
  }
}
