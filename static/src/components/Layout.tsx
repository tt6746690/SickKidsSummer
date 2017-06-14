import * as React from "react";
import "whatwg-fetch";
import {
  Grid,
  Row,
  Col,
  Button,
  ButtonGroup,
  Nav,
  NavItem,
  Panel,
  Tabs,
  Tab
} from "react-bootstrap";

import GenePanelListingContainer from "../containers/GenePanelListingContainer";
import GenePanelInfoContainer from "../containers/GenePanelInfoContainer";
import TissueSiteListingContainer from "../containers/TissueSiteListingContainer";
import TissueSiteRankingContainer from "../containers/TissueSiteRankingContainer";
import ExonBoxPlotContainer from "../containers/ExonBoxPlotContainer";
import ExonBoxPlotLegendContainer from "../containers/ExonBoxPlotLegendContainer";

import GeneBoxPlotContainer from "../containers/GeneBoxPlotContainer";

import { VIEW_TYPE } from "../reducers/Actions";

class Layout extends React.Component<any, any> {
  componentWillMount() {
    let { onComponentWillMount } = this.props;
    onComponentWillMount();
  }

  render() {
    let { viewType, onTabSelect } = this.props;

    return (
      <Grid>
        <Row id="gene-panel">
          <Panel>
            <Col xs={1}>
              <TissueSiteListingContainer />
              <GenePanelListingContainer />
            </Col>
            <Col xs={10} xsOffset={1}>
              <GenePanelInfoContainer />
            </Col>
          </Panel>
        </Row>

        <Tabs
          activeKey={viewType}
          onSelect={onTabSelect}
          animation={true}
          id="noanim-tab-example"
        >
          <Tab eventKey={VIEW_TYPE.TISSUESITE_RANKING} title="Ranking">
            <TissueSiteRankingContainer />
          </Tab>
          <Tab eventKey={VIEW_TYPE.EXON_EXPR_PLOT} title="Exon Plot">
            <ExonBoxPlotLegendContainer />
            <ExonBoxPlotContainer />
          </Tab>
          <Tab eventKey={VIEW_TYPE.GENE_EXPR_PLOT} title="Gene Plot">
            <GeneBoxPlotContainer />
          </Tab>
        </Tabs>

      </Grid>
    );
  }
}

export default Layout;
