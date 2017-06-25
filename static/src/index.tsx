import * as React from "react";

import { Jumbotron } from "react-bootstrap";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import LayoutContainer from "./containers/LayoutContainer";
import store from "./store/Store";

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
