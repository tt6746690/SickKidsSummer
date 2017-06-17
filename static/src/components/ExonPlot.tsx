import * as React from "react";

import { Row, Col } from "react-bootstrap";

class ExonPlot extends React.Component<any, object> {
  componentDidMount() {
    let { setup, geneSymbol } = this.props;
    setup(geneSymbol);
  }
  componengDidUnmount() {
    let { clean, geneSymbol } = this.props;
    clean(geneSymbol);
  }

  render() {
    let {
      data,
      plot,
      tearDown,
      preconditionSatisfied,
      geneSymbol,
      getPlotId
    } = this.props;

    if (preconditionSatisfied(data)) {
      tearDown(geneSymbol);
      console.log("ExonPlot: plot()", data);
      plot(data);
    }

    return (
      <Row>
        <Col xs={2}>{geneSymbol}</Col>
        <Col xs={10}>
          <div id={getPlotId(geneSymbol)} />
        </Col>
      </Row>
    );
  }
}

export default ExonPlot;
