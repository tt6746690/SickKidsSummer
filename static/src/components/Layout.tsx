import * as React from "react";
import "whatwg-fetch";
import {
  Grid,
  Row,
  Col,
  Button,
  ButtonGroup,
  Tab,
  Nav,
  NavItem,
  Panel
} from "react-bootstrap";

import GenePanelListingContainer from "../containers/GenePanelListingContainer";
import GenePanelInfoContainer from "../containers/GenePanelInfoContainer";
import TissueSiteListingContainer from "../containers/TissueSiteListingContainer";
import TissueSiteRankingContainer from "../containers/TissueSiteRankingContainer";
import ExonBoxPlotContainer from "../containers/ExonBoxPlotContainer";
import GeneBoxPlotContainer from "../containers/GeneBoxPlotContainer";

import { PLOT_DISPLAY_TYPE } from "../reducers/Actions";

class Layout extends React.Component<any, any> {
  componentWillMount() {
    let { onComponentWillMount } = this.props;
    onComponentWillMount();
  }

  render() {
    let { plotDisplayType, onPlotTabSelect } = this.props;

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

        <Row id="tissue">
          <Panel>
            <Col xs={8} xsOffset={2}>
              <TissueSiteRankingContainer />
            </Col>
          </Panel>
        </Row>

        <Tab.Container
          id="main-display"
          activeKey={plotDisplayType}
          onSelect={onPlotTabSelect}
        >
          <Row>
            <Col sm={2}>
              <Nav bsStyle="pills" stacked>
                <NavItem eventKey={PLOT_DISPLAY_TYPE.GENE_EXPR_PLOT}>
                  Gene Expression
                </NavItem>
                <NavItem eventKey={PLOT_DISPLAY_TYPE.EXON_EXPR_PLOT}>
                  Exon Expression
                </NavItem>
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content animation>
                <Tab.Pane eventKey={PLOT_DISPLAY_TYPE.GENE_EXPR_PLOT}>
                  <GeneBoxPlotContainer />
                </Tab.Pane>
                <Tab.Pane eventKey={PLOT_DISPLAY_TYPE.EXON_EXPR_PLOT}>
                  <ExonBoxPlotContainer />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>

      </Grid>
    );
  }
}

export default Layout;
