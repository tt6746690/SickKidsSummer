import "whatwg-fetch";

import * as React from "react";
import { Col, Grid, Panel, Row, Tab, Tabs } from "react-bootstrap";

import FetchStatusContainer from "../containers/FetchStatusContainer";
import GenePanelInfoContainer from "../containers/GenePanelInfoContainer";
import SearchBarContainer from "../containers/SearchBarContainer";
import TissueSiteListingContainer from "../containers/TissueSiteListingContainer";
import TissueSiteRankingContainer from "../containers/TissueSiteRankingContainer";
import { isNonEmptyArray } from "../utils/Utils";

class Layout extends React.Component<any, object> {
  componentWillMount() {
    let { onComponentWillMount } = this.props;
    onComponentWillMount();
  }

  render() {
    let { selectedGene, selectedGenePanel } = this.props;

    return (
      <Grid>
        <Row id="search-bar">
          <Panel>
            <Col md={6}>
              <SearchBarContainer />
            </Col>
            <Col md={2}>
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
              <Col md={12} xs={12}>
                <GenePanelInfoContainer />
              </Col>
            </Panel>
          </Row>}
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
