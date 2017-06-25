import { isEmptyObject } from "../utils/Utils";

import * as React from "react";
import { Panel } from "react-bootstrap";

class ExonBoxPlot extends React.Component<any, object> {
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
