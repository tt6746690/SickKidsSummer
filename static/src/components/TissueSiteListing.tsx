import * as React from "react";

import { DropdownButton, MenuItem } from "react-bootstrap";

class TissueSiteListing extends React.Component<any, any> {
  render() {
    let {
      tissueSite,
      selectedRefTissueSite,
      onTissueSiteListSelect
    } = this.props;

    const tissueSiteList = tissueSite.map((tissue, index) => {
      let tissueId = tissue.tissueSiteId;
      return (
        <MenuItem
          eventKey={tissueId}
          key={index.toString()}
          active={selectedRefTissueSite === tissueId}
        >
          {tissueId}
        </MenuItem>
      );
    });

    return (
      <DropdownButton
        title="Tissue Types"
        id="bg-nested-dropdown"
        onSelect={onTissueSiteListSelect}
        className="tissueSiteListing"
      >
        {tissueSiteList}
      </DropdownButton>
    );
  }
}

export default TissueSiteListing;
