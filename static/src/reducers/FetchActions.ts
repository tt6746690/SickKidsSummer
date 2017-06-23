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
import { isNonEmptyArray, isEmptyObject } from "../utils/Utils";
import { getGenePanelEntityById } from "../store/Query";

// status
export const START_FETCH = "START_FETCH";
export const END_FETCH_SUCCESS = "END_FETCH_SUCCESS";
export const END_FETCH_FAILURE = "END_FETCH_FAILURE";
export const FETCH_STATUS = {
  SUCCESS: "SUCCESS",
  FAILURE: "FALIURE"
};

export function startFetch(what: string = "") {
  return { type: START_FETCH, what };
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
        dispatch(endFetchSuccess());
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
        dispatch(endFetchSuccess());
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
      data => dispatch(loadSearchIndex(data)) && dispatch(endFetchSuccess()),
      err => {
        console.log({ fetch: err });
        dispatch(endFetchFailure());
      }
    );
  };
}

/* 
    fetch and populate entities.genePanel.<genePanelId>.panelGenes 
*/
export function fetchPanelGenesList(genePanelId: string) {
  return (dispatch, getState) => {
    let { entities: { genePanel } } = getState();
    if (genePanelPropertyPopulated(genePanel, genePanelId, "panelGenes")) {
      return Promise.resolve();
    }

    dispatch(startFetch(`${genePanelId}.panelGenes`));
    return fetchJson(
      GENE_PANEL_URL(genePanelId),
      panel => {
        dispatch(
          addGenePanel({
            genePanelId,
            panelGenes: panel.map(g => g.ensembl_id)
          })
        );
        dispatch(endFetchSuccess());

        panel.map(gene => {
          let { ensembl_id: ensemblId, symbol: geneSymbol } = gene;
          dispatch(addGene({ ensemblId, geneSymbol }));
        });
        dispatch(endFetchSuccess());
      },
      err => {
        console.log({ fetch: err });
        dispatch(endFetchFailure());
      }
    );
  };
}

/*
  fetch and populate panelGenes for the first num number of entities.genePanel
*/
export function fetchSomePanelGenesList(num: number) {
  return (dispatch, getState) => {
    let { entities: { genePanel } } = getState();

    let promises: Promise<Response>[] = [];
    genePanel.slice(0, num).forEach((panel: genePanelEntity) => {
      promises.push(dispatch(fetchPanelGenesList(panel.genePanelId)));
    });

    console.log({ promises });
    return Promise.all(promises);
  };
}

/* 
    hydrateInitialState 
    -- fetch tissueSiteList 
    -- fetch genePanelList
    -- fetch searchIndex
*/
export function hydrateInitialState() {
  return (dispatch, getState) => {
    return Promise.all([
      dispatch(fetchTissueSiteList()),
      dispatch(fetchGenePanelList()),
      dispatch(fetchSearchIndex())
    ]).then(() => {
      dispatch(fetchSomePanelGenesList(1));
    });
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

    dispatch(startFetch(`${ensemblId}.exonExpr`));
    return fetchJson(
      EXON_EXPR_URL(ensemblId),
      data => {
        let { exonExpr, tissueRanking } = data;
        dispatch(addGene({ ensemblId, exonExpr, tissueRanking }));
        dispatch(endFetchSuccess());
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

    dispatch(startFetch(`${ensemblId}.geneExpr`));
    return fetchJson(
      GENE_EXPR_URL(ensemblId),
      geneExpr =>
        dispatch(addGene({ ensemblId, geneExpr })) &&
        dispatch(endFetchSuccess()),
      err => {
        console.log({ fetch: err });
        dispatch(endFetchFailure());
      }
    );
  };
}

/* 
  fetch data related to a gene 
  -- exonExpr + tissueRanking
  -- geneExpr 
*/
export function fetchGene(ensemblId: string) {
  return dispatch => {
    return Promise.all([
      dispatch(fetchExonExpr(ensemblId)),
      dispatch(fetchGeneExpr(ensemblId))
    ]);
  };
}
/* 
  fetch an array of genes
*/
export function fetchGeneSet(ensemblIds: string[]) {
  return dispatch => {
    return ensemblIds.map(id => dispatch(fetchGene(id)));
  };
}

/* 
    if not populated previously 
    -- fetch and populate entities.genePanel.{tissueRanking} 
    -- fetch and update entities.gene for all gene in the panel
*/
export function fetchGenePanel(genePanelId: string) {
  return (dispatch, getState) => {
    let { entities: { genePanel } } = getState();
    if (genePanelPropertyPopulated(genePanel, genePanelId, "panelGenes")) {
      console.log("skipping");
      return Promise.resolve();
    }

    dispatch(startFetch(`${genePanelId}`));
    let panelEntity = getGenePanelEntityById(genePanel, genePanelId);

    return Promise.all([
      dispatch(fetchPanelGenesList(genePanelId)),
      dispatch(
        fetchGeneSet(!isEmptyObject(panelEntity) && panelEntity.panelGenes)
      ),
      fetchJson(
        GENE_PANEL_RANKING_URL(genePanelId),
        tissueRanking =>
          dispatch(addGenePanel({ genePanelId, tissueRanking })) &&
          dispatch(endFetchSuccess()),
        err => {
          console.log({ fetch: err });
          dispatch(endFetchFailure());
        }
      )
    ]);
  };
}
