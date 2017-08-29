import "whatwg-fetch";

import * as React from "react";
import { Col, Grid, Panel, Row, Tab, Tabs } from "react-bootstrap";

import FetchStatusContainer from "../containers/FetchStatusContainer";
import GenePanelInfoContainer from "../containers/GenePanelInfoContainer";
import SearchBarContainer from "../containers/SearchBarContainer";
import TissueSiteListingContainer from "../containers/TissueSiteListingContainer";
import TissueSiteRankingContainer from "../containers/TissueSiteRankingContainer";
import PanelHistoryListingContainer from "../containers/PanelHistoryListingContainer";
import ExonPlotMultiContainer from "../containers/ExonPlotMultiContainer";
import { isNonEmptyArray } from "../utils/Utils";
import { VIEW_TYPE } from "../actions/UIActions";

class Layout extends React.Component<any, object> {
  componentWillMount() {
    let { onComponentWillMount } = this.props;
    onComponentWillMount();
  }

  render() {
    let {
      viewType,
      selectedGene,
      selectedGenePanel,
      selectedRankedTissueSite,
      onTabSelect
    } = this.props;

    return (
      <Grid>
        <Row id="search-bar">
          <Panel>
            <Col md={7}>
              <SearchBarContainer />
            </Col>
            <Col md={1}>
              <FetchStatusContainer />
            </Col>
            <Col md={4}>
              <TissueSiteListingContainer />
            </Col>
          </Panel>
        </Row>
        {isNonEmptyArray(selectedGene) &&
          <Row id="gene-panel">
            <Panel>
              <Col md={9} xs={9}>
                <GenePanelInfoContainer />
              </Col>
              <Col md={3}>
                <PanelHistoryListingContainer />
              </Col>
            </Panel>
          </Row>}
        <Tabs
          activeKey={viewType}
          onSelect={onTabSelect}
          animation={true}
          id={"viewTabs"}
        >
          <Tab
            eventKey={VIEW_TYPE.TISSUESITE_RANKING}
            title="tissueSiteRanking"
          >
            <Row id="ranking">
              <Col md={12}>
                <TissueSiteRankingContainer />
              </Col>
            </Row>
          </Tab>
          <Tab eventKey={VIEW_TYPE.MULTI_EXONBOXPLOT} title="multi_exonboxplot">
            <Row id="exonboxplot">
              <Col md={12}>
                {isNonEmptyArray(selectedRankedTissueSite) &&
                  viewType === VIEW_TYPE.MULTI_EXONBOXPLOT &&
                  <ExonPlotMultiContainer />}
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Grid>
    );
  }
}

export default Layout;
