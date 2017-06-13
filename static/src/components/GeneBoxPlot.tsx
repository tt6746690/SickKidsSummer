import * as React from "react";
import * as d3 from "d3";

import { PanelGroup, Panel } from "react-bootstrap";
import { isNonEmptyArray } from "../utils/Utils";

class GeneBoxPlot extends React.Component<any, any> {
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
    if (typeof data !== "undefined" && isNonEmptyArray(data)) {
      console.log("GeneBoxPlot: plot()", data);
      plot();
    }
  }
  render() {
    return <div id="GeneBarPlot" />;
  }
}

export default GeneBoxPlot;
