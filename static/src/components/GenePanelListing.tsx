import * as React from "react";

import { DropdownButton, MenuItem } from "react-bootstrap";

class GenePanelListing extends React.Component<any, any> {
  render() {
    let { genePanel, selectedGenePanel, onGenePanelListSelect } = this.props;
    const panelListing = genePanel.map((panel, index) =>
      <MenuItem
        eventKey={panel.genePanelId}
        key={index.toString()}
        active={selectedGenePanel === panel.genePanelId}
      >
        {panel.genePanelId}
      </MenuItem>
    );
    return (
      <DropdownButton
        title="Gene Panels"
        id="bg-nested-dropdown"
        onSelect={onGenePanelListSelect}
      >
        {panelListing}
      </DropdownButton>
    );
  }
}

export default GenePanelListing;
