import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { Jumbotron, Grid } from "react-bootstrap";

import store from "./store/Store";
import GenePanelContainer from "./containers/GenePanelContainer";

const App = props =>
  <Jumbotron>
    <GenePanelContainer />
  </Jumbotron>;

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
