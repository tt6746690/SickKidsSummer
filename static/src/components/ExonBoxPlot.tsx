import * as React from "react";
import * as d3 from "d3";

import { PanelGroup, Panel } from "react-bootstrap";
import { isEmptyObject } from "../utils/Utils";

class ExonBoxPlot extends React.Component<any, object> {
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
    let { preconditionSatisfied, plot, data } = this.props;
    if (preconditionSatisfied()) {
      console.log("ExonBoxPlot: plot()", data);
      plot();
    }
  }
  render() {
    let { data, lastGeneEntity, preconditionSatisfied } = this.props;

    return (
      <Panel
        bsStyle={preconditionSatisfied() ? "success" : "default"}
        header={
          isEmptyObject(lastGeneEntity) ? undefined : lastGeneEntity.geneSymbol
        }
      >
        <div id="ExonBoxPlot" />
      </Panel>
    );
  }
}

export default ExonBoxPlot;
