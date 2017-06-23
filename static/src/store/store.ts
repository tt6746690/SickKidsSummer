import "whatwg-fetch";
import * as d3 from "d3";
import { createStore } from "redux";

import { stateInterface } from "../Interfaces";
import rootReducer from "../reducers/Root";

import { VIEW_TYPE } from "../reducers/Actions";

/* 
    Testing reducer with 
    -- let unsubscribe = store.subscribe(() => {console.log(store.getState())})
    -- store.dispatch(actionCreator(action))
    -- unsubscribe()
*/

let defaultState: stateInterface = {
  entities: {
    genePanel: [],
    gene: [],
    tissueSite: [],
    searchIndex: []
  },
  ui: {
    select: {
      genePanel: "",
      refTissueSite: "",
      gene: [],
      tissueSite: []
    },
    include: {
      gene: []
    },
    viewType: VIEW_TYPE.TISSUESITE_RANKING,
    plot: {
      color: d3.scaleOrdinal(d3.schemeCategory20),
      width: 1100,
      height: 600,
      offset: 40
    }
  }
};

let store = createStore(rootReducer, defaultState);
let unsubscribe = store.subscribe(() => {
  let {
    entities: { gene, genePanel, tissueSite, searchIndex },
    ui: {
      select: {
        gene: selectedGene,
        genePanel: selectedGenePanel,
        tissueSite: selectedTissueSite,
        refTissueSite: selectedRefTissueSite
      },
      include: { gene: includedGene }
    }
  } = store.getState();

  console.log({
    gene,
    genePanel,
    tissueSite,
    searchIndex,
    selectedGene,
    selectedGenePanel,
    selectedTissueSite,
    selectedRefTissueSite,
    includedGene
  });
});

export default store;
