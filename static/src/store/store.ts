import 'whatwg-fetch'
import { createStore } from 'redux'

import { stateInterface } from '../interfaces'
import rootReducer from '../reducers/root'

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


let store = createStore(rootReducer, defaultState)
let unsubscribe = store.subscribe(() => { let s = store.getState(); console.log(s.entities, s.ui.select) })


export default store
