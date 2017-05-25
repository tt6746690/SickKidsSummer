import * as React from "react"
import 'whatwg-fetch'

import { Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap'

import GenePanelListing from  "./GenePanelListing"
import TissueSiteListing from "./TissueSiteListing"
import GenePanelContent from "./GenePanelContent"

class GenePanel extends React.Component<any, any>{

    constructor(props) {
        super(props)
        this.state = {
            panelListing: [],
            panelGeneList: [],
            gene: {}, 
            tissueSiteList: [],
            selected: {
                tissues: [],
                genes: []
            }
        }
    }

    componentDidMount() {
        fetch('http://127.0.0.1:5000/api/gene_panels/gene_panel_list', { mode: 'cors' })
            .then((response) => response.json())
            .then((json) => {
                this.setState((prevState) => {
                    return { ...prevState, panelListing: json }
                })
            })

        fetch('http://127.0.0.1:5000/api/exon_expr/tissue_site_list', { mode: 'cors' })
            .then((response) => response.json())
            .then((json) => {
                this.setState((prevState) => {
                    return { ...prevState, tissueSiteList: json }
                })
            })
    }


    onGenePanelSelect = (eventKey) => {
        fetch('http://127.0.0.1:5000/api/gene_panels/' + eventKey, { mode: 'cors' })
            .then((response) => response.json())
            .then((json) => {
                this.setState((prevState) => {
                    return {...prevState, panelGeneList: json}
                })
            })
    }

    onPanelGeneClick = (e) => {
        fetch('http://127.0.0.1:5000/api/exon_expr/' + e.target.value, { mode: 'cors' })
            .then((response) => response.json())
            .then((json) => {
                this.setState((prevState) => {
                    return { ...prevState, gene: json }
                })
            })
    }


    onTissueListSelect = (eventKey) => {
        this.setState((prevState) => {
            return { 
                ...prevState, 
                selected: {
                    tissues: [ ...prevState.selected.tissues, eventKey]
                }
            }
        })
    }

    render() {
        return (
            <Row className="GenePanel" >
                <Col xs={1} >
                    <GenePanelListing panelListing={this.state.panelListing} genePanelSelect={this.onGenePanelSelect}/> 
                    <TissueSiteListing tissueSiteList={this.state.tissueSiteList} tissueSiteSelect={this.onTissueListSelect}/>
                </Col>
                <Col xs={9} xsOffset={1} >
                    <GenePanelContent panelGeneList={this.state.panelGeneList} panelGeneClick={this.onPanelGeneClick}/>
                </Col>
            </Row>
        )

    }
}


export default GenePanel