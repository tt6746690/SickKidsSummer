import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { Jumbotron, Grid } from "react-bootstrap";

import store from "./store/Store";
import LayoutContainer from "./containers/LayoutContainer";

const App = props =>
  <Jumbotron>
    <LayoutContainer />
  </Jumbotron>;

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
