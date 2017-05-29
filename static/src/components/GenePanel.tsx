import * as React from "react"
import 'whatwg-fetch'

import { Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap'

import GenePanelListing from  "./GenePanelListing"
import TissueSiteListing from "./TissueSiteListing"
import GenePanelContent from "./GenePanelContent"

import BarPlot from "./BarPlot"

class GenePanel extends React.Component<any, any>{

    componentWillMount(){
        this.props.onComponentWillMount()
    }
 
    render() {        
        return (
            <Grid>
                <Row className="GenePanel" >
                    <Col xs={1} >
                        <GenePanelListing 
                            selectedGenePanel={this.props.selectedGenePanel} 
                            panelListing={this.props.genePanelListing} 
                            genePanelSelect={this.props.onGenePanelSelect}/> 
                        <TissueSiteListing 
                            selectedTissueSite={this.props.selectedTissueSite}
                            tissueSiteListing={this.props.tissueSiteListing} 
                            tissueSiteSelect={this.props.onTissueListSelect}/>
                    </Col>
                    <Col xs={9} xsOffset={1} >
                        <GenePanelContent 
                            selectedGene={this.props.selectedGene}
                            selectedGenePanel={this.props.selectedGenePanel} 

                            genePanelListing={this.props.genePanelListing} 
                            gene={this.props.gene} 

                            onPanelGeneClick={this.props.onPanelGeneClick}/>
                    </Col>
                </Row>

                <Row className="BarPlot"> 
                    <Col xs={10} xsOffset={1}>
                        <BarPlot selectedGenePanel={this.props.selectedGenePanel} 
                                 selectedGene={this.props.selectedGene}
                                 selectedTissueSite={this.props.selectedTissueSite}


                                 />
                    </Col>
                </Row>
            </Grid>
        )

    }
}


export default GenePanel