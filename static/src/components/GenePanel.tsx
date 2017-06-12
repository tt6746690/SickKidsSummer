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

import GenePanelListing from "./GenePanelListing";
import GenePanelContent from "./GenePanelContent";

import ExonBarPlotContainer from "../containers/ExonBarPlotContainer";
import GeneBarPlotContainer from "../containers/GeneBarPlotContainer";
import TissueSiteListingContainer from "../containers/TissueSiteListingContainer";
import TissueSiteInfoContainer from "../containers/TissueSiteInfoContainer";

import { PLOT_DISPLAY_TYPE } from "../reducers/Actions";

class GenePanel extends React.Component<any, any> {
  componentWillMount() {
    this.props.onComponentWillMount();
  }

  render() {
    return (
      <Grid>
        <Row id="gene-panel">
          <Panel>
            <Col xs={1}>
              <GenePanelListing
                selectedGenePanel={this.props.selectedGenePanel}
                genePanel={this.props.genePanel}
                onGenePanelSelect={this.props.onGenePanelSelect}
              />
            </Col>
            <Col xs={10} xsOffset={1}>
              <GenePanelContent
                selectedGene={this.props.selectedGene}
                selectedGenePanel={this.props.selectedGenePanel}
                genePanel={this.props.genePanel}
                gene={this.props.gene}
                onPanelGeneClick={this.props.onPanelGeneClick}
                color={this.props.color}
              />
            </Col>
          </Panel>
        </Row>

        <Row id="tissue">
          <Panel>
            <Col xs={1}>
              <TissueSiteListingContainer />
            </Col>
            <Col xs={9} xsOffset={1}>
              <TissueSiteInfoContainer />
            </Col>
          </Panel>
        </Row>

        <Tab.Container
          id="main-display"
          activeKey={this.props.plotDisplayType}
          onSelect={this.props.onPlotTabSelect}
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
                  <GeneBarPlotContainer />
                </Tab.Pane>
                <Tab.Pane eventKey={PLOT_DISPLAY_TYPE.EXON_EXPR_PLOT}>
                  <ExonBarPlotContainer />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>

      </Grid>
    );
  }
}

export default GenePanel;
