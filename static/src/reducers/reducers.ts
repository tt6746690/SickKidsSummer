import { combineReducers } from 'redux'

import { ADD_GENE, 
        ADD_GENE_PANEL, 
        ADD_TISSUE_SITE, 
        SELECT_GENE_PANEL, 
        TOGGLE_GENE,
        TOGGLE_TISSUE_SITE } from "./actions"


import { geneEntity, genePanelEntity, tissueSiteEntity, stateInterface } from '../interfaces'


function toggleGeneReducer(state, action){
    if(state.includes(action.ensemblId)){
        return state.filter((ensemblId) => {
            return ensemblId != action.ensemblId    
        })
    } else {
        return [ ...state, action.ensemblId ]
    }
}

function toggleTissueSiteReducer(state, action){
    if(state.includes(action.tissueSite)){
        return state.filter((tissueSite) => {
            return tissueSite != action.tissueSite
        })
    } else {
        return [ ...state, action.tissueSite ]
    }
}


function select(state, action){
    switch (action.type) {
        case SELECT_GENE_PANEL:
            return {
                ...state, 
                genePanel: action.genePanelId
            }
        case TOGGLE_GENE:
            return {
                ...state, 
                gene: toggleGeneReducer(state.gene, action)
            }
        case TOGGLE_TISSUE_SITE:
            return {
                ...state,
                tissueSite: toggleTissueSiteReducer(state.tissueSite, action)
            }
        default:
            return state
    }
}




function ui(state, action){
    switch(action.type) {
        case SELECT_GENE_PANEL:
        case TOGGLE_GENE: 
        case TOGGLE_TISSUE_SITE: 
            return {
                ...state, 
                select: select(state.select, action)
            }
        default:
            return state
    }
}


function pushGene(state: geneEntity[] = [], action){

    if (state.findIndex((e) => e.ensemblId == action.ensemblId) == -1) {
        return [
            ...state, {
                ensemblId: action.ensemblId,
                geneSymbol: action.geneSymbol,
                geneExpr: action.geneExpr,
                exonExpr: action.exonExpr
            }
        ]
    } else {
        return state.map((gene) => {
            if (gene.ensemblId == action.ensemblId) {
                return {
                    ensemblId: action.ensemblId,
                    geneSymbol: action.geneSymbol,
                    geneExpr: action.geneExpr,
                    exonExpr: action.exonExpr
                }
            } else {
                return { ...gene }
            }
        })
        
    }

}

// -- If genePanelId already exists in entities.genePanel, 
// ---- find the matching genePanelId to that specified by action.genePanelId
// ---- then update other members 
// -- otherwise, return the previous state
function pushGenePanel(state: genePanelEntity[] = [], action) {
    if (state.findIndex((e) => e.genePanelId == action.genePanelId) == -1) {
        return [
            ...state, {
                genePanelId: action.genePanelId,
                panelGenes: [...action.panelGenes]
            }
        ]
    } else {
        return state.map((genePanel) => {
            if (genePanel.genePanelId == action.genePanelId) {
                return {
                    genePanelId: action.genePanelId,
                    panelGenes: [...action.panelGenes]
                }
            } else {
                return { ...genePanel }
            }
        })
    }
}

function pushTissueSite(state: tissueSiteEntity[] = [], action){

    return [
        ...state, {
            tissueSiteId: action.tissueSiteId
        }
    ]
}


function entities(state, action){

    switch(action.type){
        case ADD_GENE: 
            return {
                ...state,
                gene: pushGene(state.gene, action)
            }
        case ADD_GENE_PANEL: 
            return {
                ...state,
                genePanel: pushGenePanel(state.genePanel, action)
            }
        case ADD_TISSUE_SITE:
            return {
                ...state,
                tissueSite: pushTissueSite(state.tissueSite, action)
            }
        default: 
            return state 
    }
}



export default function rootReducer(state : stateInterface, action){

    return {
        entities: entities(state.entities, action),
        ui: ui(state.ui, action)
    }
}
