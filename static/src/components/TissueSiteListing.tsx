import * as React from "react";

import { SplitButton, MenuItem } from "react-bootstrap";

class TissueSiteListing extends React.Component<any, object> {
  render() {
    let {
      tissueSite,
      selectedRefTissueSite,
      onTissueSiteListSelect,
      fetchPanelGene
    } = this.props;

    const tissueSiteList = tissueSite.map((tissue, index) => {
      let tissueId = tissue.tissueSiteId;
      return (
        <MenuItem
          eventKey={tissueId}
          key={index.toString()}
          active={selectedRefTissueSite === tissueId}
        >
          {tissueId.replace(/ *\([^)]*\) */g, "")}
        </MenuItem>
      );
    });

    let tsFormatted = selectedRefTissueSite.replace(/ *\([^)]*\) */g, "");
    tsFormatted =
      tsFormatted.length >= 25
        ? tsFormatted.substring(0, 22) + "..."
        : tsFormatted;

    return (
      <SplitButton
        title={selectedRefTissueSite === "" ? "Tissue Types" : tsFormatted}
        id="bg-nested-dropdown"
        onSelect={onTissueSiteListSelect}
        className="tissueSiteListing"
      >
        {tissueSiteList}
      </SplitButton>
    );
  }
}

export default TissueSiteListing;
