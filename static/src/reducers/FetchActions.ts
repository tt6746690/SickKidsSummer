import {
  geneEntity,
  genePanelEntity,
  tissueSiteEntity,
  stateInterface,
  searchIndexEntity,
  OPTION_TYPE
} from "../Interfaces";

import {
  SEARCH_INDEX_URL,
  TISSUE_SITE_LIST_URL,
  GENE_PANEL_LIST_URL,
  EXON_EXPR_URL,
  GENE_EXPR_URL,
  GENE_PANEL_URL,
  GENE_PANEL_RANKING_URL
} from "../utils/Url";
import {
  addTissueSite,
  addGenePanel,
  addGene,
  loadSearchIndex
} from "./EntitiesActions";
import {
  genePropertyPopulated,
  genePanelPropertyPopulated
} from "../store/Query";
import { isNonEmptyArray } from "../utils/Utils";

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
    fetch helper function 
*/
const fetchJson = (url: string, onSuccess, onFailure): Promise<Response> => {
  return fetch(url, { mode: "cors" })
    .then(res => res.json())
    .then(data => onSuccess(data))
    .catch(err => onFailure(err));
};

/* 
    fetch and populates entities.tissueSite on success 
*/
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

/* 
    fetch and populates entities.genePanel on success 
*/
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

/* 
    fetch and populate entities.searchIndex 
*/
export function fetchSearchIndex() {
  return dispatch => {
    return fetchJson(
      SEARCH_INDEX_URL,
      data => dispatch(loadSearchIndex(data)),
      err => {
        console.log({ fetch: err });
        dispatch(endFetchFailure());
      }
    );
  };
}
/* 
    hydrateInitialState 
    -- fetch tissueSiteList 
    -- fetch genePanelList
    -- fetch searchIndex
*/
export function hydrateInitialState() {
  return dispatch => {
    return dispatch(fetchTissueSiteList()).then(() =>
      dispatch(fetchGenePanelList()).then(() => dispatch(fetchSearchIndex()))
    );
  };
}

/* 
    if not populated previously,
    -- fetch and populate entities.gene.ensemblId.{exonExpr, tissueRanking} on success 
    -- update networks.fetchStatus with either {STATUS_SUCCESS, STATUS_FAILURE}
*/
export function fetchExonExpr(ensemblId: string) {
  return (dispatch, getState) => {
    let { entities: { gene } } = getState();
    if (genePropertyPopulated(gene, ensemblId, "exonExpr")) {
      return Promise.resolve();
    }

    dispatch(startFetch());
    return fetchJson(
      EXON_EXPR_URL(ensemblId),
      data => {
        let { exonExpr, tissueRanking } = data;
        dispatch(addGene({ ensemblId, exonExpr, tissueRanking }));
      },
      err => {
        console.log({ fetch: err });
        dispatch(endFetchFailure());
      }
    );
  };
}

/* 
    if not populated previously,
    -- fetch and populate entities.gene.ensemblId.{geneExpr} on success 
    -- update networks.fetchStatus with either {STATUS_SUCCESS, STATUS_FAILURE}
*/
export function fetchGeneExpr(ensemblId: string) {
  return (dispatch, getState) => {
    let { entities: { gene } } = getState();
    if (genePropertyPopulated(gene, ensemblId, "geneExpr")) {
      return Promise.resolve();
    }

    dispatch(startFetch());
    return fetchJson(
      GENE_EXPR_URL(ensemblId),
      geneExpr =>
        dispatch(
          addGene({
            ensemblId,
            geneExpr
          })
        ),
      err => {
        console.log({ fetch: err });
        dispatch(endFetchFailure());
      }
    );
  };
}

/* 
    if not populated previously 
    -- fetch and populate entities.genePanel.{panelGenes, tissueRanking} 
    -- fetch and update entities.gene for all gene in the panel
*/
export function fetchGenePanel(genePanelId: string) {
  return (dispatch, getState) => {
    let { entities: { genePanel } } = getState();
    if (
      genePanelPropertyPopulated(genePanel, genePanelId, "panelGenes") &&
      genePanelPropertyPopulated(genePanel, genePanelId, "tissueRanking")
    ) {
      return Promise.resolve();
    }

    dispatch(startFetch());

    let fetchPanel = fetchJson(
      GENE_PANEL_URL(genePanelId),
      panel => {
        dispatch(
          addGenePanel({
            genePanelId,
            panelGenes: panel.map(g => g.ensembl_id)
          })
        );

        panel.map(gene => {
          let { ensembl_id: ensemblId, symbol: geneSymbol } = gene;
          dispatch(addGene({ ensemblId, geneSymbol }));
          dispatch(fetchExonExpr(ensemblId));
          dispatch(fetchGeneExpr(ensemblId));
        });
      },
      err => {
        console.log({ fetch: err });
        dispatch(endFetchFailure());
      }
    );

    let fetchPanelRanking = fetchJson(
      GENE_PANEL_RANKING_URL(genePanelId),
      tissueRanking => dispatch(addGenePanel({ genePanelId, tissueRanking })),
      err => {
        console.log({ fetch: err });
        dispatch(endFetchFailure());
      }
    );
    return Promise.all([fetchPanel, fetchPanelRanking]);
  };
}
