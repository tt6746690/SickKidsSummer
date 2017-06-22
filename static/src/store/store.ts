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
  let s = store.getState();
  console.log(s.entities, s.ui);
});

export default store;
