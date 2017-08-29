import * as React from "react";
import { Button, Collapse, Panel, Table, Row, Col } from "react-bootstrap";

import ExonPlotContainer from "../containers/ExonPlotContainer";
import { isNonEmptyArray } from "../utils/Utils";

class TissueSiteRanking extends React.Component<any, object> {
  render() {
    let {
      selectedGenePanel,
      selectedRefTissueSite,
      selectedRankedTissueSite,
      color,
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
    if (selectedGenePanel !== "" && selectedRefTissueSite !== "") {
      let ranking = getRanking();

      /* sort ranking by 
        -- 1. fraction 
        -- 2. totalExonCount
        -- 3. Id, to break tie against 1. and 2.
        in descending order, and 
        place selectedRefTissueSite to first in the list
      */
      ranking.sort((a, b) => {
        let [aId, aExonNumLen, aMedianFrac] = a;
        let [bId, bExonNumLen, bMedianFrac] = b;

        if (aMedianFrac < bMedianFrac) {
          return 1;
        } else if (aMedianFrac > bMedianFrac) {
          return -1;
        } else {
          if (aExonNumLen < bExonNumLen) {
            return 1;
          } else if (aExonNumLen > bExonNumLen) {
            return -1;
          } else {
            if (aId === selectedRefTissueSite) {
              return -1;
            } else if (aId > bId) {
              return 1;
            } else {
              return -1;
            }
          }
        }
      });

      let lastSelectedRankedTissueSite =
        selectedRankedTissueSite[selectedRankedTissueSite.length - 1];

      const selectedTissueListGroupItem = ranking.map(
        ([tissueSiteId, totalExonCount, medianFrac, meanFrac], index) => {
          let style =
            selectedRankedTissueSite.includes(tissueSiteId) ||
            selectedRefTissueSite === tissueSiteId
              ? { backgroundColor: color(tissueSiteId) }
              : undefined;

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
              <td>
                {totalExonCount}
              </td>
              <td>
                {medianFrac.toPrecision(2)}
              </td>
              <td>
                {meanFrac.toPrecision(2)}
              </td>
            </tr>
          );

          return [
            tableRow,
            selectedRankedTissueSite.includes(tissueSiteId) &&
            selectedGenePanel !== "" &&
            selectedRefTissueSite !== "" &&
            lastSelectedRankedTissueSite === tissueSiteId
              ? <Collapse in={true}>
                  <tr>
                    <td colSpan={4}>
                      <ExonPlotContainer />
                    </td>
                  </tr>
                </Collapse>
              : undefined
          ];
        }
      );

      tissueRankTable = (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Tissue Site</th>
              <th>Total Exon Counts</th>
              <th>Median # of exon covered</th>
              <th>Mean Fraction</th>
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
