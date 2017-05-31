import {
    SELECT_GENE_PANEL,
    TOGGLE_GENE,
    TOGGLE_TISSUE_SITE,
    SET_PLOT_DISPLAY
} from "./Actions"


import { geneEntity, genePanelEntity, tissueSiteEntity, stateInterface } from '../interfaces'


function toggleGeneReducer(state, action) {
    if (state.includes(action.ensemblId)) {
        return state.filter((ensemblId) => {
            return ensemblId !== action.ensemblId
        })
    } else {
        return [...state, action.ensemblId]
    }
}

function toggleTissueSiteReducer(state, action) {
    if (state.includes(action.tissueSite)) {
        return state.filter((tissueSite) => {
            return tissueSite !== action.tissueSite
        })
    } else {
        return [...state, action.tissueSite]
    }
}


function select(state, action) {
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


export default function ui(state, action) {
    switch (action.type) {
        case SET_PLOT_DISPLAY: 
            return {
                ...state, 
                plotDisplayType: action.plotDisplayType
            }
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

