import "../actions/EntitiesActions";

import {
  SELECT_VIEW,
  EMPTY_SELECTED_GENE,
  SET_GENE_PANEL,
  SET_GENEFORPLOT,
  SET_RANKED_TISSUESITE,
  TOGGLE_RANKED_TISSUESITE,
  SET_REF_TISSUESITE,
  SET_SEARCH_COLLAPSE,
  SET_SELECTED_GENE,
  APPEND_NEW_PANEL_HISTORY,
  UPDATE_SEARCH_OPTIONS
} from "../actions/UIActions";

function select(state, action) {
  switch (action.type) {
    case SELECT_VIEW:
      return { ...state, viewType: action.viewType };
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
      return { ...state, rankedTissueSite: [...action.tissueSiteId] };
    case TOGGLE_RANKED_TISSUESITE:
      let pos = state.rankedTissueSite.indexOf(action.tissueSiteId);
      let newRankedTissueSite = [...state.rankedTissueSite];
      if (pos == -1) {
        newRankedTissueSite.push(action.tissueSiteId);
      } else {
        newRankedTissueSite.splice(pos, 1);
      }
      return {
        ...state,
        rankedTissueSite: [...newRankedTissueSite]
      };

    case APPEND_NEW_PANEL_HISTORY:
      let panelHistory: string[] = state.panelHistory.filter(
        genePanelId => genePanelId !== action.genePanelId
      );
      panelHistory.push(action.genePanelId);

      return {
        ...state,
        panelHistory
      };
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
    case TOGGLE_RANKED_TISSUESITE:
    case APPEND_NEW_PANEL_HISTORY:
      return { ...state, select: select(state.select, action) };
    case UPDATE_SEARCH_OPTIONS:
    case SET_SEARCH_COLLAPSE:
      return { ...state, search: search(state.search, action) };
    default:
      return state;
  }
}
