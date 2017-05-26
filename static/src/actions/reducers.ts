import { combineReducers } from 'redux'

import { SELECT_GENE_PANEL, SELECT_TISSUE_SITE, TOGGLE_GENE } from "./actions"


const initialState = {
    /*
        [
            {
                "genePanel": [ { ensemblId, geneSymbol, selected = false }, ... ],
                "selected": false
            }
            ...
        ]
    */
    genePanel: [],
    tissueSite: ""
}



function panelGeneList(state = [], action){

    switch(action.type){
        case TOGGLE_GENE: 
            return state.map((gene) => {
                if(action.ensemblId == gene.ensemblId){
                    return {
                        ...gene,
                        selected: !gene.selected 
                    }
                } else {
                    return { ...gene }
                }
            })
    }

}


function genePanel(state = [], action){
    switch (action.type){
        case SELECT_GENE_PANEL: 
           return state.map((panel) => {
               if(panel.hasOwnProperty(action.genePanel)){
                   return {
                       ...panel,
                       selected: true 
                   }
               } else {
                   return {
                       ...panel, 
                       selected: false
                   }
               }
           })
        case TOGGLE_GENE:
            return state.map((panel) => {

                // Given { <panelName>: [], selected: false }
                // Returns <panelName>
                let getPanelName = (panel) => {
                    let panelObjKeys = [ ... Object.keys(panel) ]
                    let panelObjKeysExcludeSelected = panelObjKeys.splice(panelObjKeys.indexOf("selected"))
                    console.assert(panelObjKeysExcludeSelected.length == 1, "getPanelKey: incorrect obj key length")
                    let panelName = panelObjKeysExcludeSelected[0]
                    return panelName
                }

                 // select and unselect operates on selected genePanel only
                if (panel.selected) {
                    let panelList = panel[getPanelName(panel)]
                    return panelGeneList(panelList, action)
                } else {
                    return { ...panel }
                }

            })
        default: 
            return state
    }
}


function tissueSite(state, action){
    switch(action.type){
        case SELECT_TISSUE_SITE: 
            return action.tissueSite
        default: 
            return state
    }
}



export default function rootReducer(state  = initialState, action){
    
    return {
        tissueSite: tissueSite(state.tissueSite, action), 
        genePanel: genePanel(state.genePanel, action)
    }
}
