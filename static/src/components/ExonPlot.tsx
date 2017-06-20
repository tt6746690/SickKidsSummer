import * as React from "react";

import { Row, Col, Panel, Button, Well } from "react-bootstrap";
import { formatExonPlotData } from "../utils/Plot";
import { queryTissueRankingByGeneId } from "../store/Query";

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
    let {
      color,
      gene,
      selectedGene,
      getPlotId,
      selectedTissueSiteLast,
      selectedRefTissueSite,
      onPanelGeneClick
    } = this.props;

    console.log("ExonPlot::render()");

    let ExonPlotList = gene.map((g, i) => {
      let geneSymbol = g.geneSymbol;

      let {
        exonNumLen: sub,
        exons: rankedTissueSiteExons
      } = queryTissueRankingByGeneId(
        gene,
        g.ensemblId,
        selectedRefTissueSite,
        selectedTissueSiteLast
      );

      let {
        exonNumLen: total,
        exons: refTissueSiteExons
      } = queryTissueRankingByGeneId(
        gene,
        g.ensemblId,
        selectedRefTissueSite,
        selectedRefTissueSite
      );

      return (
        <Row key={i.toString()}>
          <Col md={2}>
            <Row>
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
            </Row>
            <Row style={{ paddingTop: "7px" }}>
              <Col xs={4}>
                {sub + "/" + total}
              </Col>
              <Col xs={6}>
                {total === 0 ? 0 : (sub / total).toPrecision(3)}
              </Col>
            </Row>

          </Col>
          <Col md={10}>
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
