import { isEmptyObject } from "../utils/Utils";

import * as React from "react";
import { Panel } from "react-bootstrap";

class ExonBoxPlot extends React.Component<any, object> {
  componentDidMount() {
    let { data, setUp, plot, preconditionSatisfied } = this.props;
    setUp();
    if (preconditionSatisfied()) {
      plot();
    }
  }
  componentWillUnmount() {
    let { tearDown, cleanUp } = this.props;
    tearDown();
    cleanUp();
  }
  render() {
    let { data, geneEntity, preconditionSatisfied } = this.props;

    return (
      <Panel
        bsStyle={preconditionSatisfied() ? "success" : "default"}
        header={isEmptyObject(geneEntity) ? undefined : geneEntity.geneSymbol}
      >
        <div id="ExonBoxPlot" />
      </Panel>
    );
  }
}

export default ExonBoxPlot;
