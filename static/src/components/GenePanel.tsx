import * as React from "react"
import 'whatwg-fetch'

import { Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap'

import GenePanelListing from  "./GenePanelListing"
import TissueSiteListing from "./TissueSiteListing"
import GenePanelContent from "./GenePanelContent"

class GenePanel extends React.Component<any, any>{

    componentWillMount(){
        this.props.onComponentWillMount()
    }
 
    render() {        
        return (
            <Row className="GenePanel" >
                <Col xs={1} >
                    <GenePanelListing 
                        panelListing={this.props.genePanelListing} 
                        genePanelSelect={this.props.onGenePanelSelect}/> 
                    <TissueSiteListing 
                        tissueSiteListing={this.props.tissueSiteListing} 
                        tissueSiteSelect={this.props.onTissueListSelect}/>
                </Col>
                <Col xs={9} xsOffset={1} >
                    <GenePanelContent 
                        selectedGenePanel={this.props.selectedGenePanel} 
                        genePanelListing={this.props.genePanelListing} 
                        
                        gene={this.props.gene} 
                        onPanelGeneClick={this.props.onPanelGeneClick}/>
                </Col>
            </Row>
        )

    }
}


export default GenePanel