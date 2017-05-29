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



const hydrateInitialState = (store) => {

    console.log("hydrate initial state...")

    let fetchPanelListPromise = fetch('http://127.0.0.1:5000/api/gene_panels/gene_panel_list', { mode: 'cors' })
        .then((response) => response.json())
        .then((json) => {

            console.log("fetch: success in gene panel list")
            if (typeof json !== 'undefined' && json.length > 0){
                json.map((genePanel) => {
                    console.log("loop: ", genePanel)
                    store.dispatch(addGenePanel({
                        genePanelId: genePanel
                    }))
                    console.log("loop: after dispatch ", genePanel)
                })

                store.dispatch(selectGenePanel(json[0]))
            }
            
        })
        .catch(() => console.log("fetch: /api/gene_panels/gene_panel_list"))

    let fetchTissueSitePromise = fetch('http://127.0.0.1:5000/api/exon_expr/tissue_site_list', { mode: 'cors' })
        .then((response) => response.json())
        .then((json) => {

            if (typeof json !== 'undefined' && json.length > 0) {
                json.map((tissueSite) => {
                    store.dispatch(addTissueSite({
                        tissueSiteId: tissueSite
                    }))
                })
            } 

        })
        .catch(() => console.log("fetch: /api/exon_expr/tissue_site_list"))

    Promise.all([fetchPanelListPromise, fetchTissueSitePromise])

    setTimeout(()=>{}, 2000)
}


// let preloadedState = hydrateInitialState(defaultState)
let store = createStore(rootReducer, defaultState)
let unsubscribe = store.subscribe(() => { console.log(store.getState()) })

// hydrateInitialState(store)


export default store
