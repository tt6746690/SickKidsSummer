import 'whatwg-fetch'
import { createStore } from 'redux'

import { selectGenePanel, toggleGene, toggleTissueSite, addGene, addGenePanel, addTissueSite } from './actions'
import { geneEntity, genePanelEntity, tissueSiteEntity, stateInterface } from '../interfaces'
import rootReducer from './reducers'

/* 
    Testing reducer with 
    -- let unsubscribe = store.subscribe(() => {console.log(store.getState())})
    -- store.dispatch(actionCreator(action))
    -- unsubscribe()
*/


let defaultState = {
    entities: {},
    ui: {
        select: {}
    }
}


const hydrateInitialState = (state) => {

    let fetchPanelListPromise = fetch('http://127.0.0.1:5000/api/gene_panels/gene_panel_list', { mode: 'cors' })
        .then((response) => response.json())
        .then((json) => {

            if (typeof json !== 'undefined' && json.length > 0){
                state.entities.genePanel = json.map((genePanel) => {
                    return {
                        genePanelId: genePanel
                    }
                })
                state.ui.select.genePanel = json[0]
            }
            
        })
        .catch(() => console.log("fetch: /api/gene_panels/gene_panel_list"))

    let fetchTissueSitePromise = fetch('http://127.0.0.1:5000/api/exon_expr/tissue_site_list', { mode: 'cors' })
        .then((response) => response.json())
        .then((json) => {

            if (typeof json !== 'undefined' && json.length > 0) {
                state.entities.tissueSite = json.map((tissueSite) => {
                    return {
                        tissueSiteId: tissueSite
                    }
                })
            } 

        })
        .catch(() => console.log("fetch: /api/exon_expr/tissue_site_list"))

    Promise.all([fetchPanelListPromise, fetchTissueSitePromise])
    return { ...state }
}


let preloadedState = hydrateInitialState(defaultState)
let store = createStore(rootReducer, preloadedState)

let unsubscribe = store.subscribe(() => { console.log(store.getState()) })

export default store
