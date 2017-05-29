import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from 'react-redux'

import { Jumbotron, Grid } from 'react-bootstrap'

// import GenePanel from './components/GenePanel'
import store from './store/store'
import GenePanelContainer from './containers/GenePanelContainer'


const App = (props) => (
    <Jumbotron>
        <Grid>
            <GenePanelContainer />
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

