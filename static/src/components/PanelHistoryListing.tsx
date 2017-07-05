import * as React from "react";
import { MenuItem, SplitButton, Row, Col, Button } from "react-bootstrap";

import { genePanelEntity } from "../Interfaces";
import {
  getGenePanelEntityByIdList,
  ensemblIdsToGeneSymbolList
} from "../store/Query";
import { reverseGeneSetHash } from "../utils/Hash";

class PanelHistoryListing extends React.Component<any, object> {
  render() {
    let {
      gene,
      genePanel,
      panelHistory,
      onPanelHistorySelect,
      selectedGenePanel,
      onPreviousHistoryClick,
      onNextHistoryClick
    } = this.props;

    let panelGeneSymbolHistory = panelHistory.map(genePanelId => {
      let ensemblIds = reverseGeneSetHash(genePanelId);
      let geneSymbols = ensemblIdsToGeneSymbolList(gene, ensemblIds);
      return { genePanelId, geneSymbols };
    });

    const panelHistoryList = panelGeneSymbolHistory.map(
      ({ genePanelId, geneSymbols }, index) => {
        return (
          <MenuItem
            eventKey={genePanelId}
            key={index.toString()}
            active={genePanelId === selectedGenePanel}
          >
            {geneSymbols.join(", ")}
          </MenuItem>
        );
      }
    );

    return (
      <Row>
        <Col md={2}>
          <a onClick={onPreviousHistoryClick}>
            <i
              className="fa fa-angle-double-left fa-border fa-2x"
              aria-hidden="true"
              style={{ height: "46px" }}
            />
          </a>
        </Col>
        <Col md={8}>
          <SplitButton
            title={"history"}
            bsSize={"large"}
            id="bg-nested-dropdown"
            onSelect={onPanelHistorySelect}
            className="panelHistoryListing"
          >
            {panelHistoryList}
          </SplitButton>
        </Col>
        <Col md={2}>
          <a onClick={onNextHistoryClick}>
            <i
              className="fa fa-angle-double-right fa-border fa-2x"
              aria-hidden="true"
              style={{ height: "46px" }}
            />
          </a>
        </Col>
      </Row>
    );
  }
}

export default PanelHistoryListing;
