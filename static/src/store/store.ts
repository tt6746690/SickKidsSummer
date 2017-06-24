import "whatwg-fetch";
import * as d3 from "d3";
import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";

import { stateInterface } from "../Interfaces";
import { VIEW_TYPE } from "../reducers/EntitiesActions";
import rootReducer from "../reducers/Root";

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
    },
    search: {
      selectedOptions: [],
      collapse: false
    }
  },
  networks: {
    isFetching: false,
    fetchStatus: ""
  }
};

let store = createStore(rootReducer, defaultState, applyMiddleware(ReduxThunk));

let unsubscribe = store.subscribe(() => {
  let { entities, ui, networks } = store.getState();

  console.log({
    entities,
    ui,
    networks
  });
});

export default store;
