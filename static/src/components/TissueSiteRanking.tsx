import * as React from "react";
import { Table, Button, Panel } from "react-bootstrap";

import ExonPlotContainer from "../containers/ExonPlotContainer";
import { tissueSiteEntity } from "../Interfaces";
import { isNonEmptyArray } from "../utils/Utils";
import { formatExonPlotData } from "../utils/Plot";

class TissueSiteRanking extends React.Component<any, object> {
  render() {
    let {
      selectedGenePanel,
      selectedTissueSite,
      selectedRefTissueSite,
      selectedTissueSiteLast,
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
    if (selectedGenePanel != "" && selectedRefTissueSite != "") {
      let ranking = getRanking();

      /* sort ranking by 
        -- 1. fraction 
        -- 2. totalExonCount
        -- 3. Id, to break tie against 1. and 2.
        in descending order
      */
      ranking.sort((a, b) => {
        let [aId, aExonNumLen, aMeanFrac] = a;
        let [bId, bExonNumLen, bMeanFrac] = b;

        if (aMeanFrac < bMeanFrac) {
          return 1;
        } else if (aMeanFrac > bMeanFrac) {
          return -1;
        } else {
          if (aExonNumLen < bExonNumLen) {
            return 1;
          } else if (aExonNumLen > bExonNumLen) {
            return -1;
          } else {
            if (aId > bId) {
              return 1;
            } else {
              return -1;
            }
          }
        }
      });

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

          return [
            tableRow,

            selectedTissueSiteLast === tissueSiteId &&
              selectedGenePanel !== "" &&
              selectedRefTissueSite !== "" &&
              isNonEmptyArray(selectedTissueSite)
              ? <ExonPlotContainer />
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
