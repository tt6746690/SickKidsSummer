import * as React from "react";
import { Button, Col, Panel, Row } from "react-bootstrap";

import { queryTissueRankingByGeneId } from "../store/Query";
import { formatExonPlotData } from "../utils/Plot";

class ExonPlot extends React.Component<any, object> {
  componentDidMount() {
    console.log("ExonPlot: setUp() + plot()");
    let {
      gene,
      selectedTissueSiteLast,
      preconditionSatisfied,
      selectedRefTissueSite,
      setUp,
      plot
    } = this.props;

    gene.forEach(g => {
      setUp(g.geneSymbol, selectedTissueSiteLast);
      setUp(g.geneSymbol, selectedRefTissueSite);

      let refData = formatExonPlotData(g, selectedRefTissueSite);
      let rankedData = formatExonPlotData(g, selectedTissueSiteLast);

      if (preconditionSatisfied(rankedData) && preconditionSatisfied(refData)) {
        console.log("ExonPlot: plot()", rankedData, refData);

        plot(rankedData, { noXLabel: true });
        plot(refData);
      }
    });
  }
  componentWillUnmount() {
    console.log("ExonPlot: cleanUp()");

    let {
      gene,
      cleanUp,
      selectedTissueSiteLast,
      selectedRefTissueSite
    } = this.props;
    gene.forEach(
      g =>
        cleanUp(g.geneSymbol, selectedTissueSiteLast) &&
        cleanUp(g.geneSymbol, selectedRefTissueSite)
    );
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

    /* 
      sort gene based on
      -- 1. fraction, descending
      -- 2. exonNumLen, descending
      -- 3. geneSymbol, alphabetical
    */
    let geneSorted = gene
      .map((g, i) => {
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

        let fraction = total === 0
          ? Number(0).toPrecision(3)
          : (sub / total).toPrecision(3);

        return {
          g,
          sub,
          total,
          fraction
        };
      })
      .sort((a, b) => {
        let { fraction: aFrac, sub: aSub, g: { geneSymbol: aGeneSymbol } } = a;
        let { fraction: bFrac, sub: bSub, g: { geneSymbol: bGeneSymbol } } = b;

        if (aFrac < bFrac) {
          return 1;
        } else if (aFrac > bFrac) {
          return -1;
        } else {
          if (aSub < bSub) {
            return 1;
          } else if (aSub > bSub) {
            return -1;
          } else {
            return aGeneSymbol - bGeneSymbol;
          }
        }
      });

    let ExonPlotList = geneSorted.map(({ g, sub, total, fraction }, i) => {
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
                {fraction}
              </Col>
            </Row>

          </Col>
          <Col md={10}>
            <div id={getPlotId(g.geneSymbol, selectedTissueSiteLast)} />
            <div id={getPlotId(g.geneSymbol, selectedRefTissueSite)} />
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
