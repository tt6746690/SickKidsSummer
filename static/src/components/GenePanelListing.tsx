import * as React from "react";

import { SplitButton, MenuItem } from "react-bootstrap";
import { pad } from "../utils/Utils";
import { getIncompleteGeneEntity } from "../store/Query";

class GenePanelListing extends React.Component<any, object> {
  render() {
    let {
      gene,
      genePanel,
      selectedGenePanel,
      onGenePanelListSelect,
      fetchPanelGene
    } = this.props;

    const panelListing = genePanel.map((panel, index) =>
      <MenuItem
        eventKey={panel.genePanelId}
        key={index.toString()}
        active={selectedGenePanel === panel.genePanelId}
      >
        {panel.genePanelId
          .split("_")
          .map(d => d.replace(/\b\w/g, f => f.toUpperCase()))
          .join(" ")}
      </MenuItem>
    );

    let formatSelectedGenePanel = selectedGenePanel
      .split("_")
      .map(d => d.replace(/\b\w/g, f => f.toUpperCase()))
      .join(" ");

    return (
      <SplitButton
        bsSize="large"
        pullRight
        title={
          selectedGenePanel === ""
            ? "Gene Panels"
            : pad(formatSelectedGenePanel, " ", 30, false)
        }
        id="bg-nested-dropdown"
        onSelect={onGenePanelListSelect}
        className="genePanelListing"
      >
        {panelListing}
      </SplitButton>
    );
  }
}

export default GenePanelListing;
