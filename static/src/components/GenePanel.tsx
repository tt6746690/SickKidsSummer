import * as React from "react"
import 'whatwg-fetch'

import { Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap'

import GenePanelListing from  "./GenePanelListing"
import TissueSiteListing from "./TissueSiteListing"
import GenePanelContent from "./GenePanelContent"

class GenePanel extends React.Component<any, any>{


    componentDidMount(){
        // setTimeout(() => {
        //     console.log("GenePanel:componentDidMount", this.store.getState())
        // }, 2000)

        console.log("GenePanel:componentDidMount", this.props.tissueSiteList)
        let { propFromReduxState } = this.props
        console.log(propFromReduxState)
    }
 
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         panelListing: [],
    //         tissueSiteList: [],
    //         panelGeneList: [],
    //         gene: {}, 
    //         selected: {
    //             tissues: [],
    //             genes: []
    //         }
    //     }
    // }
    // 
    // componentDidMount() {
    //     fetch('http://127.0.0.1:5000/api/gene_panels/gene_panel_list', { mode: 'cors' })
    //         .then((response) => response.json())
    //         .then((json) => {
    //             this.setState((prevState) => {
    //                 return { ...prevState, panelListing: json }
    //             })
    //         })

    //     fetch('http://127.0.0.1:5000/api/exon_expr/tissue_site_list', { mode: 'cors' })
    //         .then((response) => response.json())
    //         .then((json) => {
    //             this.setState((prevState) => {
    //                 return { ...prevState, tissueSiteList: json }
    //             })
    //         })
    // }


    // onGenePanelSelect = (eventKey) => {
    //     fetch('http://127.0.0.1:5000/api/gene_panels/' + eventKey, { mode: 'cors' })
    //         .then((response) => response.json())
    //         .then((json) => {
    //             this.setState((prevState) => {
    //                 return {...prevState, panelGeneList: json}
    //             })
    //         })
    // }

    // onPanelGeneClick = (e) => {
    //     fetch('http://127.0.0.1:5000/api/exon_expr/' + e.target.value, { mode: 'cors' })
    //         .then((response) => response.json())
    //         .then((json) => {
    //             this.setState((prevState) => {
    //                 return { ...prevState, gene: json }
    //             })
    //         })
    // }


    // onTissueListSelect = (eventKey) => {
    //     this.setState((prevState) => {
    //         return { 
    //             ...prevState, 
    //             selected: {
    //                 tissues: [ ...prevState.selected.tissues, eventKey]
    //             }
    //         }
    //     })
    // }

    render() {

        console.log("components/GenePanel", this.props.genePanelListing)
        
        return (
            <Row className="GenePanel" >
                <Col xs={1} >
                    <GenePanelListing panelListing={this.props.genePanelListing} genePanelSelect={this.props.onGenePanelSelect}/> 
                    <TissueSiteListing tissueSiteListing={this.props.tissueSiteListing} tissueSiteSelect={this.props.onTissueListSelect}/>
                </Col>
                <Col xs={9} xsOffset={1} >
                    <GenePanelContent panelGeneList={this.props.panelGeneList} panelGeneClick={this.props.onPanelGeneClick}/>
                </Col>
            </Row>
        )

    }
}


export default GenePanel