import * as React from "react"
import * as ReactDOM from "react-dom"

import { Provider } from 'react-redux'

import { Jumbotron, Grid } from 'react-bootstrap'

import GenePanel from './components/GenePanel'
import store from './reducers/store'


import { selectGenePanel, toggleGene, toggleTissueSite, addGene, addGenePanel, addTissueSite } from './reducers/actions'


const App = (props) => (
    <Jumbotron>
        <Grid>
            <GenePanel />
        </Grid>
    </Jumbotron>
)


ReactDOM.render(
    (
        <Provider store={store}>
            <App />
        </Provider>
    ),
    document.getElementById('root')
)
