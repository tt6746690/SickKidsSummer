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

import GenePanelInfoContainer from "../containers/GenePanelInfoContainer";
import TissueSiteListingContainer from "../containers/TissueSiteListingContainer";
import TissueSiteRankingContainer from "../containers/TissueSiteRankingContainer";
import ExonBoxPlotContainer from "../containers/ExonBoxPlotContainer";
import ExonBoxPlotLegendContainer from "../containers/ExonBoxPlotLegendContainer";
import SearchBarContainer from "../containers/SearchBarContainer";
import GeneBoxPlotContainer from "../containers/GeneBoxPlotContainer";
import FetchStatusContainer from "../containers/FetchStatusContainer";

import { VIEW_TYPE } from "../reducers/EntitiesActions";

class Layout extends React.Component<any, object> {
  componentWillMount() {
    let { onComponentWillMount } = this.props;
    onComponentWillMount();
  }

  render() {
    let { viewType, selectedGenePanel, onTabSelect } = this.props;

    return (
      <Grid>
        <Row id="search-bar">
          <Panel>
            <Col md={8}>
              <SearchBarContainer />
            </Col>
            <Col md={1}>
              <FetchStatusContainer />
            </Col>
            <Col md={3}>
              <TissueSiteListingContainer />
            </Col>
          </Panel>
        </Row>
        <Row id="gene-panel">
          <Panel>
            <Col md={8} xs={12}>
              <GenePanelInfoContainer />
            </Col>
          </Panel>
        </Row>

        <Tabs
          activeKey={viewType}
          onSelect={onTabSelect}
          animation={true}
          id="noanim-tab-example"
        />
        <Tab eventKey={VIEW_TYPE.TISSUESITE_RANKING} title="Ranking">
          <TissueSiteRankingContainer />
        </Tab>;

      </Grid>
    );
  }
}

export default Layout;

/* 
<Tab eventKey={VIEW_TYPE.TISSUESITE_RANKING} title="Ranking">
  <TissueSiteRankingContainer />
</Tab>;
 <Tab eventKey={VIEW_TYPE.EXON_EXPR_PLOT} title="Exon Plot">
            <ExonBoxPlotContainer />
            <ExonBoxPlotLegendContainer />
          </Tab>
          <Tab eventKey={VIEW_TYPE.GENE_EXPR_PLOT} title="Gene Plot">
            <GeneBoxPlotContainer />
          </Tab>
*/
