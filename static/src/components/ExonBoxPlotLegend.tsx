import * as React from "react";
import { ButtonGroup, Button, Panel } from "react-bootstrap";

class ExonBoxPlotLegend extends React.Component<any, any> {
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
      <Panel>
        <ButtonGroup>
          {selectedTissueButtons}
        </ButtonGroup>
      </Panel>
    );
  }
}

export default ExonBoxPlotLegend;
