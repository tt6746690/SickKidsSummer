import * as React from "react";
import * as d3 from "d3";

import { PanelGroup, Panel } from "react-bootstrap";
import { isEmptyObject } from "../utils/Utils";

class GeneBarPlot extends React.Component<any, any> {
  componentDidMount() {
    let { setup } = this.props;
    setup();
  }
  componengDidUnmount() {
    let { clean } = this.props;
    clean();
  }
  componentWillUpdate() {
    let { tearDown } = this.props;
    tearDown();
  }
  componentDidUpdate() {
    let { data, plot } = this.props;
    if (typeof data !== "undefined" && !isEmptyObject(data)) {
      plot();
    }
  }
  render() {
    return <div id="GeneBarPlot" />;
  }
}

export default GeneBarPlot;
