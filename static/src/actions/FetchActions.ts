import { genePanelEntity } from "../Interfaces";
import {
  genePanelPanelGenesPopulated,
  genePanelTissueRankingPopulated,
  genePropertyPopulated,
  geneSymbolPopulated
} from "../store/Query";
import { getGenePanelEntityById } from "../store/Query";
import {
  EXON_EXPR_URL,
  GENE_EXPR_URL,
  GENE_PANEL_LIST_URL,
  GENE_PANEL_RANKING_URL,
  GENE_PANEL_URL,
  GENE_SYMBOL_URL,
  SEARCH_INDEX_URL,
  TISSUE_SITE_LIST_URL
} from "../utils/Url";
import { isEmptyObject, isNonEmptyArray } from "../utils/Utils";
import {
  addGene,
  addGenePanel,
  addTissueSite,
  loadSearchIndex,
  populatePanelRanking
} from "./EntitiesActions";

// status
export const START_FETCH = "START_FETCH";
export const END_FETCH_SUCCESS = "END_FETCH_SUCCESS";
export const END_FETCH_FAILURE = "END_FETCH_FAILURE";
export const FETCH_STATUS = {
  SUCCESS: "SUCCESS",
  FAILURE: "FALIURE"
};
export const RESET_FETCH_STATUS = "RESET_FETCH_STATUS";

export function startFetch(msg: string = "") {
  return { type: START_FETCH, msg };
}
export function endFetchSuccess(msg: string = "") {
  return { type: END_FETCH_SUCCESS, status: FETCH_STATUS.SUCCESS, msg };
}
export function endFetchFailure(msg: string = "") {
  return { type: END_FETCH_FAILURE, status: FETCH_STATUS.FAILURE, msg };
}

export function resetFetchStatus() {
  return {
    type: RESET_FETCH_STATUS
  };
}

/* 
    fetch helper function 
*/
const defaultOnFailure = err => console.log({ err });
const fetchJson = (
  url: string,
  onSuccess,
  onFailure = defaultOnFailure
): Promise<Response> => {
  return fetch(url, { mode: "cors" })
    .then(res => res.json())
    .then(data => onSuccess(data))
    .catch(err => onFailure(err));
};

/* 
    fetch and populates entities.tissueSite on success 
*/
function _fetchTissueSiteList() {
  return dispatch => {
    return fetchJson(TISSUE_SITE_LIST_URL, tissueList => {
      isNonEmptyArray(tissueList) &&
        dispatch(
          addTissueSite(
            tissueList.map(ts => {
              return {
                tissueSiteId: ts
              };
            })
          )
        );
    });
  };
}

/* 
    fetch and populates entities.genePanel on success 
*/
function _fetchGenePanelList() {
  return dispatch => {
    return fetchJson(GENE_PANEL_LIST_URL, panelList =>
      panelList.map(panel => dispatch(addGenePanel({ genePanelId: panel })))
    );
  };
}

/* 
    fetch and populate entities.searchIndex 
*/
function _fetchSearchIndex() {
  return dispatch => {
    return fetchJson(SEARCH_INDEX_URL, data => dispatch(loadSearchIndex(data)));
  };
}

/* 
    fetch and populate entities.genePanel.<genePanelId>.panelGenes 
*/
function _fetchPanelGenesList(genePanelId: string) {
  return (dispatch, getState) => {
    let { entities: { genePanel } } = getState();
    if (genePanelPanelGenesPopulated(genePanel, genePanelId)) {
      return Promise.resolve();
    }

    return fetchJson(GENE_PANEL_URL(genePanelId), panel => {
      dispatch(
        addGenePanel({
          genePanelId,
          panelGenes: panel.map(g => g.ensembl_id)
        })
      );

      panel.map(gene => {
        let { ensembl_id: ensemblId, symbol: geneSymbol } = gene;
        dispatch(addGene({ ensemblId, geneSymbol }));
      });
    });
  };
}

/*
  fetch and populate panelGenes for the first num number of entities.genePanel
  -- num === -1: all panels 
  -- num !== -1: number specified by num
*/
function _fetchSomePanelGenesList(num: number) {
  return (dispatch, getState) => {
    let { entities: { genePanel } } = getState();

    let promises: Promise<Response>[] = [];
    let panelSlice: genePanelEntity[] =
      num === -1 ? genePanel : genePanel.slice(0, num);

    panelSlice.forEach((panel: genePanelEntity) => {
      promises.push(dispatch(_fetchPanelGenesList(panel.genePanelId)));
    });

    return Promise.all(promises);
  };
}

/*  
  fetch and populate entities.genePanel.<panel>.tissueRanking

  -- deprecated..
*/
function _fetchGenePanelTissueRanking(genePanelId: string) {
  return (dispatch, getState) => {
    let { entities: { genePanel } } = getState();

    if (genePanelTissueRankingPopulated(genePanel, genePanelId)) {
      return Promise.resolve();
    }

    return fetchJson(GENE_PANEL_RANKING_URL(genePanelId), tissueRanking =>
      dispatch(addGenePanel({ genePanelId, tissueRanking }))
    );
  };
}

/* 
    if not populated previously,
    -- fetch and populate entities.gene.ensemblId.{exonExpr, tissueRanking} on success 
    -- update networks.fetchStatus with either {STATUS_SUCCESS, STATUS_FAILURE}
*/
function _fetchExonExpr(ensemblId: string) {
  return dispatch => {
    return fetchJson(EXON_EXPR_URL(ensemblId), data => {
      let { exonExpression: exonExpr, tissueRanking } = data;
      return dispatch(addGene({ ensemblId, exonExpr, tissueRanking }));
    });
  };
}

/* 
    if not populated previously,
    -- fetch and populate entities.gene.ensemblId.{geneExpr} on success 
    -- update networks.fetchStatus with either {STATUS_SUCCESS, STATUS_FAILURE}
*/
function _fetchGeneExpr(ensemblId: string) {
  return dispatch => {
    return fetchJson(GENE_EXPR_URL(ensemblId), geneExpr =>
      dispatch(addGene({ ensemblId, geneExpr }))
    );
  };
}

function _fetchGeneSymbol(ensemblId: string) {
  return dispatch => {
    return fetchJson(GENE_SYMBOL_URL(ensemblId), data => {
      let { geneSymbol } = data;
      return dispatch(addGene({ ensemblId, geneSymbol }));
    });
  };
}

/* 
  fetch data related to a gene 
  -- exonExpr + tissueRanking
  -- geneExpr 
*/
function _fetchGene(ensemblId: string) {
  return (dispatch, getState) => {
    let { entities: { gene } } = getState();
    if (
      !geneSymbolPopulated(gene, ensemblId) ||
      !genePropertyPopulated(gene, ensemblId, "exonExpr")
    ) {
      return dispatch(_fetchGeneSymbol(ensemblId)).then(() =>
        dispatch(_fetchExonExpr(ensemblId))
      );
    } else {
      return Promise.resolve();
    }
  };
}

/* 
  fetch an array of genes
*/
function _fetchGeneSet(ensemblIds: string[]) {
  return dispatch => {
    return Promise.all(ensemblIds.map(id => dispatch(_fetchGene(id))));
  };
}

/* 
  Publicly exposed API 
  -- fetchGene 
  ---- fetch Gene.{exonExpr, geneSymbol} and populate corresponding entry in state.entities.gene
  -- fetchGenePanel
  ---- fetch and update entities.gene for all genes in the panel (i.e. call fetchGene(g) for all g in panel)
  -- hydrateInitialState
  ---- fetch tissueSiteList, genePanelList, searchIndex

  Note these network actions are prefixed by a startFetch action and 
  postfixed by either a endFetch{Success, Failure} action
*/

export function fetchGene(ensemblId: string) {
  return (dispatch, getState) => {
    let { entities: { gene } } = getState();
    if (
      !geneSymbolPopulated(gene, ensemblId) ||
      !genePropertyPopulated(gene, ensemblId, "exonExpr")
    ) {
      dispatch(startFetch(`fetching ${ensemblId}`));
      return dispatch(_fetchGene(ensemblId)).then(() =>
        dispatch(endFetchSuccess())
      );
    } else {
      return Promise.resolve();
    }
  };
}

export function fetchGenePanel(genePanelId: string) {
  return (dispatch, getState) => {
    dispatch(startFetch(`fetching ${genePanelId}...`));

    return dispatch(_fetchPanelGenesList(genePanelId))
      .then(result => {
        let { entities: { genePanel } } = getState();
        let panelEntity = getGenePanelEntityById(genePanel, genePanelId);
        return dispatch(
          _fetchGeneSet(!isEmptyObject(panelEntity) && panelEntity.panelGenes)
        );
      })
      .then(() => dispatch(populatePanelRanking(genePanelId)))
      .then(() => dispatch(endFetchSuccess("success!")));
  };
}

export function hydrateInitialState() {
  return (dispatch, getState) => {
    dispatch(startFetch("hydrate initial state..."));
    return Promise.all([
      dispatch(_fetchTissueSiteList()),
      dispatch(_fetchGenePanelList()),
      dispatch(_fetchSearchIndex())
    ])
      .then(() => {
        dispatch(_fetchSomePanelGenesList(1));
      })
      .then(() => dispatch(endFetchSuccess()));
  };
}
