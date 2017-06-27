import "whatwg-fetch";

import * as d3 from "d3";
import { applyMiddleware, createStore, compose } from "redux";
import ReduxThunk from "redux-thunk";

import { stateInterface } from "../Interfaces";
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
      gene: [],
      geneForPlot: "",
      genePanel: "",
      refTissueSite: "",
      rankedTissueSite: ""
    },
    plot: {
      color: d3.scaleOrdinal(d3.schemeCategory20),
      width: 1100,
      height: 600,
      offset: 40
    },
    search: {
      selectedOptions: [],
      collapse: true
    }
  },
  networks: {
    isFetching: false,
    fetchStatus: ""
  }
};

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(
  rootReducer,
  defaultState,
  compose(applyMiddleware(ReduxThunk))
);

let unsubscribe = store.subscribe(() => {
  let { entities, ui, networks } = store.getState();
  let { networks: { isFetching } } = store.getState();

  console.log({ entities, ui, networks, isFetching });
});

export default store;
