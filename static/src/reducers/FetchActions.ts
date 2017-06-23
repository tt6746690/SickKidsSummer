import {
  geneEntity,
  genePanelEntity,
  tissueSiteEntity,
  stateInterface,
  searchIndexEntity,
  OPTION_TYPE
} from "../Interfaces";

import { TISSUE_SITE_LIST_URL, GENE_PANEL_LIST_URL } from "../utils/Url";
import { isNonEmptyArray } from "../utils/Utils";
import { addTissueSite, addGenePanel } from "./EntitiesActions";

// status
export const START_FETCH = "START_FETCH";
export const END_FETCH_SUCCESS = "END_FETCH_SUCCESS";
export const END_FETCH_FAILURE = "END_FETCH_FAILURE";
export const FETCH_STATUS = {
  SUCCESS: "SUCCESS",
  FAILURE: "FALIURE"
};

export function startFetch() {
  return { type: START_FETCH };
}
export function endFetchSuccess() {
  return { type: END_FETCH_SUCCESS, status: FETCH_STATUS.SUCCESS };
}
export function endFetchFailure() {
  return { type: END_FETCH_FAILURE, status: FETCH_STATUS.FAILURE };
}

/* 
    Async fetch flow 

    hydrateInitialState 
    -- fetch tissueSiteList 
    -- fetch genePanelList
*/
const fetchJson = (url: string, onSuccess, onFailure): Promise<Response> => {
  return fetch(url, { mode: "cors" })
    .then(res => res.json())
    .then(data => onSuccess(data))
    .catch(err => onFailure(err));
};

export function fetchTissueSiteList() {
  return dispatch => {
    dispatch(startFetch());
    return fetchJson(
      TISSUE_SITE_LIST_URL,
      tissueList => {
        isNonEmptyArray(tissueList) &&
          tissueList.map(ts => dispatch(addTissueSite({ tissueSiteId: ts })));
      },
      err => {
        console.log({ fetch: err });
        dispatch(endFetchFailure());
      }
    );
  };
}

export function fetchGenePanelList() {
  return dispatch => {
    dispatch(startFetch());
    return fetchJson(
      GENE_PANEL_LIST_URL,
      panelList => {
        isNonEmptyArray(panelList) &&
          panelList.map(panel =>
            dispatch(addGenePanel({ genePanelId: panel }))
          );
      },
      err => {
        console.log({ fetch: err });
        dispatch(endFetchFailure());
      }
    );
  };
}

export function hydrateInitialState() {
  return dispatch => {
    return dispatch(fetchTissueSiteList()).then(() =>
      dispatch(fetchGenePanelList())
    );
  };
}
