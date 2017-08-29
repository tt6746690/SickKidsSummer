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

class ExonPlotMulti extends React.Component<any, object> {
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

    console.log("ExonPlotMulti: componentDidMount");

    geneEntityList.forEach(g => {
      selectedRankedTissueSite.forEach(tissueSiteId => {
        setUp(g.geneSymbol, tissueSiteId);
      });
      setUp(g.geneSymbol, selectedRefTissueSite);

      let refData = formatExonPlotData(g, selectedRefTissueSite);

      if (!preconditionSatisfied(refData)) return;

      selectedRankedTissueSite.forEach(tissueSiteId => {
        let rankedData = formatExonPlotData(g, tissueSiteId);
        if (preconditionSatisfied(rankedData)) {
          console.log({
            where: "plotting" + tissueSiteId,
            rankedData
          });
          plot(rankedData, { noXLabel: true });
        }
      });

      plot(refData);
    });
  }
  componentWillUnmount() {
    console.log("ExonPlotMulti: cleanUp()");

    let {
      gene,
      selectedGene,
      selectedRefTissueSite,
      selectedRankedTissueSite,
      cleanUp
    } = this.props;

    let geneEntityList = getGeneEntityByIdList(gene, selectedGene);
    geneEntityList.forEach(g => {
      cleanUp(g.geneSymbol, selectedRefTissueSite);
      selectedRankedTissueSite.forEach(tissueSiteId => {
        cleanUp(g.geneSymbol, tissueSiteId);
      });
    });
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
    // let geneSorted = geneEntityList
    //   .map((g, i) => {
    //     let geneSymbol = g.geneSymbol;
    //     let {
    //       exonNumLen: sub,
    //       exons: rankedTissueSiteExons
    //     } = queryTissueRankingByGeneId(
    //       gene,
    //       g.ensemblId,
    //       selectedRefTissueSite,
    //       lastSelectedRankedTissueSite
    //     );
    //     let {
    //       exonNumLen: total,
    //       exons: refTissueSiteExons
    //     } = queryTissueRankingByGeneId(
    //       gene,
    //       g.ensemblId,
    //       selectedRefTissueSite,
    //       selectedRefTissueSite
    //     );

    //     let fraction =
    //       total === 0 ? Number(0).toPrecision(3) : (sub / total).toPrecision(3);

    //     return { g, sub, total, fraction };
    //   })
    //   .sort((a, b) => {
    //     let { fraction: aFrac, sub: aSub, g: { geneSymbol: aGeneSymbol } } = a;
    //     let { fraction: bFrac, sub: bSub, g: { geneSymbol: bGeneSymbol } } = b;

    //     if (aFrac < bFrac) {
    //       return 1;
    //     } else if (aFrac > bFrac) {
    //       return -1;
    //     } else {
    //       if (aSub < bSub) {
    //         return 1;
    //       } else if (aSub > bSub) {
    //         return -1;
    //       } else {
    //         return aGeneSymbol.length - bGeneSymbol.length;
    //       }
    //     }
    //   });

    // let ExonPlotList = geneSorted.map(({ g, sub, total, fraction }, i) => {
    let ExonPlotList = geneEntityList.map((g, i) => {
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
          </Col>
          <Col md={10}>
            {selectedRankedTissueSite.map(tissueSiteId => {
              return (
                <div
                  id={getPlotId(g.geneSymbol, tissueSiteId)}
                  key={tissueSiteId}
                />
              );
            })}
            <div id={getPlotId(g.geneSymbol, selectedRefTissueSite)} />
          </Col>
        </Row>
      );
    });

    return (
      <div>
        <Panel>
          {ExonPlotList}
        </Panel>
      </div>
    );
  }
}

export default ExonPlotMulti;
