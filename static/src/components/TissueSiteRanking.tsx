import * as React from "react";
import { Table, Button, Panel } from "react-bootstrap";

import ExonPlot from "./ExonPlot";
import { tissueSiteEntity } from "../Interfaces";
import { isNonEmptyArray } from "../utils/Utils";
import { formatExonPlotData } from "../utils/Plot";

class TissueSiteRanking extends React.Component<any, object> {
  render() {
    let {
      gene,
      ranking,
      selectedGenePanel,
      selectedTissueSite,
      selectedRefTissueSite,

      /* ExonPlot props */
      color,
      getPlotId,
      plotName,
      setup,
      cleanUp,
      tearDown,
      plot,
      preconditionSatisfied,
      getRanking,
      onTissueSiteClick
    } = this.props;

    let tissueRankTable = <Table />;

    /* 
    Ranking is available only if user has selected 
    -- genePanel
    -- reference tissueSite
    Note entities.genePanel must be populated before a selection is possible
    so no need to check entities.genePanel nonempty
    */
    if (selectedGenePanel != "" && selectedRefTissueSite != "") {
      let ranking = getRanking();

      /* sort ranking by 
        -- 1. fraction 
        -- 2. totalExonCount
        in descending order
      */
      ranking.sort((a, b) => {
        let [aId, aCount, aFrac] = a;
        let [bId, bCount, bFrac] = b;

        if (aFrac < bFrac) {
          return 1;
        } else if (aFrac > bFrac) {
          return -1;
        } else {
          if (aCount < bCount) {
            return 1;
          } else {
            return -1;
          }
        }
      });

      let selectedTissueSiteLast =
        selectedTissueSite[selectedTissueSite.length - 1];

      const selectedTissueListGroupItem = ranking.map(
        ([tissueSiteId, totalExonCount, fraction], index) => {
          let style = {
            ...selectedTissueSite.includes(tissueSiteId) && {
              backgroundColor: color(tissueSiteId)
            }
          };

          let tableRow = (
            <tr key={index.toString()}>
              <td>
                <Button
                  value={tissueSiteId}
                  style={style}
                  onClick={onTissueSiteClick}
                >
                  {tissueSiteId}
                </Button>
              </td>
              <td>{totalExonCount}</td>
              <td>{fraction.toPrecision(2)}</td>
            </tr>
          );

          console.log("TissueSiteRanking:: render()");

          return [
            tableRow,

            selectedTissueSiteLast === tissueSiteId &&
              selectedGenePanel !== "" &&
              selectedRefTissueSite !== "" &&
              isNonEmptyArray(selectedTissueSite)
              ? <Panel>
                  {gene.map((g, i) => {
                    return (
                      <ExonPlot
                        key={i.toString()}
                        geneSymbol={g.geneSymbol}
                        data={formatExonPlotData(g, selectedTissueSiteLast)}
                        plotName={plotName}
                        getPlotId={getPlotId}
                        setup={setup}
                        cleanUp={cleanUp}
                        tearDown={tearDown}
                        plot={plot}
                        preconditionSatisfied={preconditionSatisfied}
                        selectedTissueSiteLast={
                          selectedTissueSiteLast
                        } /* passed to prop to trigger re-render */
                      />
                    );
                  })}
                </Panel>
              : undefined
          ];
        }
      );

      tissueRankTable = (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>tissue Site</th>
              <th>total Exon Counts</th>
              <th>Median Fraction</th>
            </tr>
          </thead>
          <tbody>
            {selectedTissueListGroupItem}
          </tbody>
        </Table>
      );
    }

    return (
      <Panel className={"tissueRankingPanel"}>
        {tissueRankTable}
      </Panel>
    );
  }
}
export default TissueSiteRanking;
