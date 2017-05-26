import 'whatwg-fetch'
import { createStore } from 'redux'

import { selectGenePanel, toggleGene, toggleTissueSite, addGene, addGenePanel, addTissueSite } from './actions'
import { stateInterface } from './interfaces'
import rootReducer from './reducers'


/* 
    Testing reducer with 
    -- let unsubscribe = store.subscribe(() => {console.log(store.getState())})
    -- store.dispatch(actionCreator(action))
    -- unsubscribe()
*/


let initialState = {
    entities: {
        genePanel: [],
        gene: [],
        tissueSite: []
    },
    ui: {
        select: {
            genePanel: "",
            gene: [],
            tissueSite: []
        }
    }
}

const hydrateInitialState = () => {

    let fetchPanelListPromise = fetch('http://127.0.0.1:5000/api/gene_panels/gene_panel_list', { mode: 'cors' })
        .then((response) => response.json())
        .then((json) => {

            if (typeof json !== 'undefined' && json.length > 0){
                initialState.entities.genePanel = json
                initialState.ui.select.genePanel = json[0]
            }
            
        })
        .catch(() => console.log("fetch: /api/gene_panels/gene_panel_list"))

    let fetchTissueSitePromise = fetch('http://127.0.0.1:5000/api/exon_expr/tissue_site_list', { mode: 'cors' })
        .then((response) => response.json())
        .then((json) => {

            if (typeof json !== 'undefined' && json.length > 0) {
                initialState.entities.tissueSite = [...json]
            } 

        })
        .catch(() => console.log("fetch: /api/exon_expr/tissue_site_list"))

    Promise.all([fetchPanelListPromise, fetchTissueSitePromise])
}



hydrateInitialState()

let store = createStore(rootReducer, initialState)

export default store
