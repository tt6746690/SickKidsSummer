import * as React from "react";
import { Table, ListGroup, ListGroupItem, Button } from "react-bootstrap";

import { tissueSiteEntity } from "../Interfaces";

class TissueSiteRanking extends React.Component<any, any> {
  render() {
    let {
      ranking,
      selectedGenePanel,
      selectedTissueSite,
      selectedRefTissueSite,
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

      const selectedTissueListGroupItem = ranking.map(
        ([tissueSiteId, totalExonCount, fraction], index) => {
          let style = {
            ...selectedTissueSite.includes(tissueSiteId) && {
              backgroundColor: color(tissueSiteId)
            }
          };

          return (
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

    return tissueRankTable;
  }
}

export default TissueSiteRanking;
