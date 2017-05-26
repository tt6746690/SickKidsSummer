import * as React from "react"
import * as ReactDOM from "react-dom"
import { createStore } from 'redux'

import { Jumbotron, Grid } from 'react-bootstrap'


import GenePanel from './components/GenePanel'

import rootReducer from './actions/reducers'
import { selectGenePanel, toggleGene, selectTissueSite } from './actions/actions'



class App extends React.Component<any, any>{


    componentDidMount() {

        let initialState = {}


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

    render(){
        return (
            <Jumbotron>
                <Grid>
                    <GenePanel />
                </Grid> 
            </Jumbotron>
        )
    }
}





ReactDOM.render(
    <App />,
    document.getElementById('root')
)
