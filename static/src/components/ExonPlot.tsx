import * as React from "react";
import { Button, Col, Modal, Panel, Row } from "react-bootstrap";

import ExonBoxPlotContainer from "../containers/ExonBoxPlotContainer";
import ExonBoxPlotLegendContainer from "../containers/ExonBoxPlotLegendContainer";
import {
  getGeneEntityById,
  getGeneEntityByIdList,
  queryTissueRankingByGeneId
} from "../store/Query";
import { formatExonPlotData } from "../utils/Plot";

class ExonPlot extends React.Component<any, object> {
  componentDidMount() {
    let {
      gene,
      selectedGene,
      selectedRefTissueSite,
      selectedRankedTissueSite,
      setUp,
      plot,
      preconditionSatisfied
    } = this.props;

    let geneEntityList = getGeneEntityByIdList(gene, selectedGene);
    let lastSelectedRankedTissueSite =
      selectedRankedTissueSite[selectedRankedTissueSite.length - 1];

    geneEntityList.forEach(g => {
      setUp(g.geneSymbol, lastSelectedRankedTissueSite);
      setUp(g.geneSymbol, selectedRefTissueSite);

      let refData = formatExonPlotData(g, selectedRefTissueSite);
      let rankedData = formatExonPlotData(g, lastSelectedRankedTissueSite);

      if (preconditionSatisfied(rankedData) && preconditionSatisfied(refData)) {
        plot(rankedData, { noXLabel: true });
        plot(refData);
      }
    });
  }
  componentWillUnmount() {
    let {
      gene,
      selectedGene,
      selectedRefTissueSite,
      selectedRankedTissueSite,
      cleanUp
    } = this.props;

    let lastSelectedRankedTissueSite =
      selectedRankedTissueSite[selectedRankedTissueSite.length - 1];

    let geneEntityList = getGeneEntityByIdList(gene, selectedGene);
    geneEntityList.forEach(
      g =>
        cleanUp(g.geneSymbol, selectedRefTissueSite) &&
        cleanUp(g.geneSymbol, lastSelectedRankedTissueSite)
    );
  }

  render() {
    let {
      color,
      gene,
      selectedGene,
      selectedGeneForPlot,
      getPlotId,
      selectedRankedTissueSite,
      selectedRefTissueSite,
      onModalOpen,
      onModalClose
    } = this.props;

    let geneEntityList = getGeneEntityByIdList(gene, selectedGene);

    let lastSelectedRankedTissueSite =
      selectedRankedTissueSite[selectedRankedTissueSite.length - 1];

    /* 
      sort gene based on
      -- 1. fraction, descending
      -- 2. exonNumLen, descending
      -- 3. geneSymbol, alphabetical
    */
    let geneSorted = geneEntityList
      .map((g, i) => {
        let geneSymbol = g.geneSymbol;
        let {
          exonNumLen: sub,
          exons: rankedTissueSiteExons
        } = queryTissueRankingByGeneId(
          gene,
          g.ensemblId,
          selectedRefTissueSite,
          lastSelectedRankedTissueSite
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

        let fraction =
          total === 0 ? Number(0).toPrecision(3) : (sub / total).toPrecision(3);

        return { g, sub, total, fraction };
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
            return aGeneSymbol.length - bGeneSymbol.length;
          }
        }
      });

    let ExonPlotList = geneSorted.map(({ g, sub, total, fraction }, i) => {
      /* 
      style={
                  selectedGene.includes(g.ensemblId)
                    ? { backgroundColor: color(g.ensemblId) }
                    : undefined
                }
              */
      return (
        <Row key={i.toString()}>
          <Col md={2}>
            <Row>
              <Col xsOffset={2}>
                <Button
                  className={"panelGeneButton"}
                  value={g.ensemblId}
                  onClick={onModalOpen}
                >
                  {g.geneSymbol.toUpperCase()}
                </Button>
              </Col>
            </Row>
            <Row style={{ paddingTop: "7px" }}>
              <Col xs={4}>{sub + "/" + total}</Col>
              <Col xs={6}>{fraction}</Col>
            </Row>
          </Col>
          <Col md={10}>
            <div id={getPlotId(g.geneSymbol, lastSelectedRankedTissueSite)} />
            <div id={getPlotId(g.geneSymbol, selectedRefTissueSite)} />
          </Col>
        </Row>
      );
    });

    return (
      <div>
        <Panel>{ExonPlotList}</Panel>
        <Modal
          bsSize={"large"}
          show={selectedGeneForPlot !== ""}
          onHide={onModalClose}
          dialogClassName={"ExonBoxPlotModal"}
        >
          <Modal.Header>
            <Modal.Title>
              {`${getGeneEntityById(gene, selectedGeneForPlot)
                .geneSymbol} Exon RNA-Expression plot`}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <ExonBoxPlotContainer />
            <ExonBoxPlotLegendContainer />
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={onModalClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ExonPlot;
