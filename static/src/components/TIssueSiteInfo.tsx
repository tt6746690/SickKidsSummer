import * as React from "react";
import { ButtonGroup, Button } from "react-bootstrap";

class TissueSiteInfo extends React.Component<any, any> {
  render() {
    let { selectedTissueSite, onTissueSiteClick, color } = this.props;

    let selectedTissueButtons = selectedTissueSite.map(
      (tissueSiteId, index) => {
        return (
          <Button
            value={tissueSiteId}
            key={index.toString()}
            style={{ backgroundColor: color(tissueSiteId) }}
            onClick={onTissueSiteClick}
          >
            {tissueSiteId}
          </Button>
        );
      }
    );

    return (
      <ButtonGroup>
        {selectedTissueButtons}
      </ButtonGroup>
    );
  }
}

export default TissueSiteInfo;
