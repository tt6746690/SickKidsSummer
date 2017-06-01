import * as React from "react"
import 'whatwg-fetch'

import { Grid, Row, Col, Button, ButtonGroup, Tab, Nav, NavItem, Panel } from 'react-bootstrap'

import GenePanelListing from  "./GenePanelListing"
import GenePanelContent from "./GenePanelContent"

import TissueSiteListing from "./TissueSiteListing"
import TissueSiteContent from "./TIssueSiteContent"

import ExonBarPlotContainer from "../containers/ExonBarPlotContainer"
import ExonBarPlot from "./ExonBarPlot"

import { PLOT_DISPLAY_TYPE } from "../reducers/Actions"

class GenePanel extends React.Component<any, any>{

    componentWillMount(){
        this.props.onComponentWillMount()
    }
 
    render() {        
        return (
            <Grid>
                <Row id="gene-panel" >
                    <Panel> 
                        <Col xs={1} >
                            <GenePanelListing
                                selectedGenePanel={this.props.selectedGenePanel}
                                panelListing={this.props.genePanelListing}
                                genePanelSelect={this.props.onGenePanelSelect} />
                        </Col>
                        <Col xs={10} xsOffset={1}>
                            <GenePanelContent
                                selectedGene={this.props.selectedGene}
                                selectedGenePanel={this.props.selectedGenePanel}

                                genePanelListing={this.props.genePanelListing}
                                gene={this.props.gene}

                                onPanelGeneClick={this.props.onPanelGeneClick} />
                        </Col>
                    </Panel>
                </Row>

                <Row id="tissue">
                    <Panel> 
                        <Col xs={1}>
                            <TissueSiteListing
                                selectedTissueSite={this.props.selectedTissueSite}
                                tissueSiteListing={this.props.tissueSiteListing}
                                onTissueSiteSelect={this.props.onTissueListSelect}/>
                        </Col>
                        <Col xs={9} xsOffset={1}>
                            <TissueSiteContent
                                selectedTissueSite={this.props.selectedTissueSite}
                                onTissueSiteClick={this.props.onTissueSiteClick} />
                        </Col>
                    </Panel> 
                </Row> 
 
                <Tab.Container id='main-display' 
                                activeKey={this.props.plotDisplayType}
                                onSelect={this.props.onPlotTabSelect}>
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
                                    gene expr here
                                </Tab.Pane>
                                <Tab.Pane eventKey={PLOT_DISPLAY_TYPE.EXON_EXPR_PLOT}>
                                    <ExonBarPlotContainer />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>

            </Grid>
        )

    }
}


export default GenePanel