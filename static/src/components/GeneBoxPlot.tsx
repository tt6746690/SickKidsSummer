import * as React from "react";
import * as d3 from "d3";

import { PanelGroup, Panel } from "react-bootstrap";
import { isNonEmptyArray } from "../utils/Utils";

class GeneBoxPlot extends React.Component<any, object> {
  componentDidMount() {
    let { setUp } = this.props;
    setUp();
  }
  componentWillUnmount() {
    let { cleanUp } = this.props;
    cleanUp();
  }
  componentWillUpdate() {
    let { tearDown } = this.props;
    tearDown();
  }
  componentDidUpdate() {
    let { data, plot, preconditionSatisfied } = this.props;
    if (preconditionSatisfied()) {
      plot();
    }
  }
  render() {
    let { preconditionSatisfied, geneEntities } = this.props;
    return (
      <Panel
        bsStyle={preconditionSatisfied() ? "success" : "default"}
        header={
          isNonEmptyArray(geneEntities)
            ? geneEntities.map(d => d.geneSymbol).join("  ")
            : undefined
        }
      >
        <div id="GeneBoxPlot" />
      </Panel>
    );
  }
}

export default GeneBoxPlot;
