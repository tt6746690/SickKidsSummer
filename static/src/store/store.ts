import "whatwg-fetch";

import * as d3 from "d3";
import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import ReduxThunk from "redux-thunk";

import { stateInterface } from "../Interfaces";
import rootReducer from "../reducers/Root";
import { PROD } from "../utils/Url";
import {
  ADD_GENE,
  ADD_GENE_PANEL,
  ADD_TISSUE_SITE,
  LOAD_SEARCH_INDEX
} from "../actions/EntitiesActions";
import { isNonEmptyArray } from "../utils/Utils";

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

const devMiddlewares = [];
if (!PROD) {
  const logger = createLogger({
    diff: true,
    duration: true,
    diffPredicate: (getState, action) => {
      let blackList = [
        ADD_TISSUE_SITE,
        ADD_GENE,
        ADD_GENE_PANEL,
        LOAD_SEARCH_INDEX
      ];
      let { entities: { searchIndex }, networks: { isFetching } } = getState();
      if (blackList.includes(action) || isFetching) {
        return false;
      }
      return true;
    }
  });
  devMiddlewares.push(logger);
}

let store = createStore(
  rootReducer,
  defaultState,
  compose(applyMiddleware(ReduxThunk, ...devMiddlewares))
);

export default store;
