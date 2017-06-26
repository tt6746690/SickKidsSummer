import * as React from "react";
import { Button, ButtonGroup, Panel } from "react-bootstrap";

class ExonBoxPlotLegend extends React.Component<any, object> {
  render() {
    let {
      selectedRefTissueSite,
      selectedRankedTissueSite,
      onTissueSiteClick,
      color
    } = this.props;

    let selectedTissueButtons = [
      selectedRefTissueSite,
      selectedRankedTissueSite
    ].map((tissueSiteId, index) => {
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
    });

    return (
      <Panel>
        <ButtonGroup>
          {selectedTissueButtons}
        </ButtonGroup>
      </Panel>
    );
  }
}

export default ExonBoxPlotLegend;
