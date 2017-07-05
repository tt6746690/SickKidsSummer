import * as React from "react";
import { MenuItem, SplitButton } from "react-bootstrap";

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
      selectedGenePanel
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
      <SplitButton
        title={"history"}
        bsSize={"large"}
        id="bg-nested-dropdown"
        onSelect={onPanelHistorySelect}
        className="panelHistoryListing"
      >
        {panelHistoryList}
      </SplitButton>
    );
  }
}

export default PanelHistoryListing;
