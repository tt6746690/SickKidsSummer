import * as React from "react";

import { Row, Col, Panel, Button } from "react-bootstrap";
import { formatExonPlotData } from "../utils/Plot";

class ExonPlot extends React.Component<any, object> {
  componentDidMount() {
    console.log("ExonPlot: setUp() + plot()");
    let {
      gene,
      selectedTissueSiteLast,
      preconditionSatisfied,
      setUp,
      plot
    } = this.props;
    gene.forEach(g => {
      setUp(g.geneSymbol);
      let data = formatExonPlotData(g, selectedTissueSiteLast);
      if (preconditionSatisfied(data)) {
        console.log("ExonPlot: plot()", data);
        plot(data);
      }
    });
  }
  componentWillUnmount() {
    console.log("ExonPlot: cleanUp()");

    let { gene, cleanUp } = this.props;
    gene.forEach(g => cleanUp(g.geneSymbol));
  }

  render() {
    let { color, gene, selectedGene, getPlotId, onPanelGeneClick } = this.props;
    console.log("ExonPlot::render()");

    let ExonPlotList = gene.map((g, i) => {
      let geneSymbol = g.geneSymbol;
      return (
        <Row key={i.toString()}>
          <Col xs={2}>
            <Button
              className={"panelGeneButton"}
              value={g.ensemblId}
              onClick={onPanelGeneClick}
              style={
                selectedGene.includes(g.ensemblId)
                  ? { backgroundColor: color(g.ensemblId) }
                  : undefined
              }
            >
              {g.geneSymbol.toUpperCase()}
            </Button>
          </Col>
          <Col xs={10}>
            <div id={getPlotId(geneSymbol)} />
          </Col>
        </Row>
      );
    });

    return (
      <Panel>
        {ExonPlotList}
      </Panel>
    );
  }
}

export default ExonPlot;
