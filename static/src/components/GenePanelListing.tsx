import * as React from "react";

import { SplitButton, MenuItem } from "react-bootstrap";

class GenePanelListing extends React.Component<any, any> {
  render() {
    let { genePanel, selectedGenePanel, onGenePanelListSelect } = this.props;

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
    return (
      <SplitButton
        pullRight
        title={
          selectedGenePanel === ""
            ? "Gene Panels"
            : selectedGenePanel
                .split("_")
                .map(d => d.replace(/\b\w/g, f => f.toUpperCase()))
                .join(" ")
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
