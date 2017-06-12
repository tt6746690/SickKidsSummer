import "whatwg-fetch";
import * as d3 from "d3";
import { createStore } from "redux";

import { stateInterface } from "../Interfaces";
import rootReducer from "../reducers/Root";

import { PLOT_DISPLAY_TYPE } from "../reducers/Actions";

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
    tissueSite: []
  },
  ui: {
    select: {
      genePanel: "",
      gene: [],
      tissueSite: []
    },
    plotDisplayType: PLOT_DISPLAY_TYPE.GENE_EXPR_PLOT,
    plot: {
      color: d3.scaleOrdinal(d3.schemeCategory20),
      width: 945,
      height: 600,
      offset: 60
    }
  }
};

let store = createStore(rootReducer, defaultState);
let unsubscribe = store.subscribe(() => {
  let s = store.getState();
  console.log(s.entities, s.ui);
});

export default store;
