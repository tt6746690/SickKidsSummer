import "whatwg-fetch";

import * as React from "react";
import { Col, Grid, Panel, Row, Tab, Tabs } from "react-bootstrap";

import FetchStatusContainer from "../containers/FetchStatusContainer";
import GenePanelInfoContainer from "../containers/GenePanelInfoContainer";
import SearchBarContainer from "../containers/SearchBarContainer";
import TissueSiteListingContainer from "../containers/TissueSiteListingContainer";
import TissueSiteRankingContainer from "../containers/TissueSiteRankingContainer";
import { VIEW_TYPE } from "../reducers/EntitiesActions";
import { isNonEmptyArray } from "../utils/Utils";

class Layout extends React.Component<any, object> {
  componentWillMount() {
    let { onComponentWillMount } = this.props;
    onComponentWillMount();
  }

  render() {
    let { viewType, selectedGene, selectedGenePanel, onTabSelect } = this.props;

    return (
      <Grid>
        <Row id="search-bar">
          <Panel>
            <Col md={10}>
              <SearchBarContainer />
            </Col>
            <Col md={2}>
              <FetchStatusContainer />
            </Col>
          </Panel>
        </Row>
        <Row id="gene-panel">
          <Panel>
            {isNonEmptyArray(selectedGene) &&
              <Col md={8} xs={12}>
                <GenePanelInfoContainer />
              </Col>}
            <Col md={4} xs={12}>
              <TissueSiteListingContainer />
            </Col>
          </Panel>
        </Row>
        <Row id="ranking">
          <Col md={12}>
            <TissueSiteRankingContainer />
          </Col>
        </Row>

      </Grid>
    );
  }
}

export default Layout;

/* 
 <Tabs
          activeKey={viewType}
          onSelect={onTabSelect}
          animation={true}
          id="noanim-tab-example"
        />
        <Tab eventKey={VIEW_TYPE.TISSUESITE_RANKING} title="Ranking">
          <TissueSiteRankingContainer />
        </Tab>;
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
