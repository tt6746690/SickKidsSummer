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
  componentWillUpdate() {
    let { tearDown, geneSymbol } = this.props;
    tearDown(geneSymbol);
  }
  componentDidUpdate() {
    let { data, plot } = this.props;
    console.log("ExonPlot: plot()", data);
    plot(data);
  }

  render() {
    let { geneSymbol, data, plotName } = this.props;

    console.log({ geneSymbol, data, plotName });

    return (
      <Row>
        <Col xs={2}>{geneSymbol}</Col>
        <Col xs={10}>
          <div id={geneSymbol + "_" + plotName} />
        </Col>
      </Row>
    );
  }
}

export default ExonPlot;
