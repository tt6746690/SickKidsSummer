import * as React from "react"
import 'whatwg-fetch'

import { Grid, Row, Col } from 'react-bootstrap'

import GenePanelListing from  "./GenePanelListing"
import GenePanelContent from "./GenePanelContent"

class GenePanel extends React.Component<any, any>{

    constructor(props) {
        super(props)
        this.state = {
            panelListing: [],
            panelGeneList: [],
            exon_expr: {}
        }
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
                    return { ...prevState, exon_expr: json }
                })
            })
        console.log(this.state.exon_expr)
    }

    componentDidMount(){
        fetch('http://127.0.0.1:5000/api/gene_panels/gene_panel_list', { mode: 'cors' })
            .then((response) => response.json())
            .then((json) => {
                this.setState((prevState) => {
                    return { ...prevState, panelListing: json }
                })
            })
    }

    render() {
        return (
            <Row className="GenePanel" >
                <Col xs={1} >
                    <GenePanelListing panelListing={this.state.panelListing} genePanelSelect={this.onGenePanelSelect}/> 
                </Col>
                <Col xs={10} xsOffset={2} >
                    <GenePanelContent panelGeneList={this.state.panelGeneList} panelGeneClick={this.onPanelGeneClick}/>
                </Col>
            </Row>
        )

    }
}


export default GenePanel