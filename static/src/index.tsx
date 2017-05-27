import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from 'react-redux'

import { Jumbotron, Grid } from 'react-bootstrap'

// import GenePanel from './components/GenePanel'
import store from './reducers/store'
import GenePanelContainer from './containers/GenePanelContainer'



console.log('initial state ', store.getState())
// console.log('initial state: entities', store.getState().entities)

// console.log("adding 2 genes...")

// import { addGene } from './reducers/actions'

// store.dispatch(addGene({
//     ensemblId: "wtf"
// }))

// store.dispatch(addGene({
//     ensemblId: "stsdfs"
// }))


// console.log('after adding 2 genes:entities ', store.getState().entities)




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

