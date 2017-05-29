import { geneEntity, genePanelEntity, tissueSiteEntity, stateInterface } from '../interfaces'

// actionTypes

// entity 
export const ADD_GENE = "ADD_GENE"
export const ADD_GENE_PANEL = "ADD_GENE_PANEL"
export const ADD_TISSUE_SITE = "ADD_TISSUE_SITE"

// ui 
export const SELECT_GENE_PANEL = 'SELECT_GENE_PANEL'

export const TOGGLE_GENE = 'TOGGLE_GENE'
export const TOGGLE_TISSUE_SITE = 'TOGGLE_TISSUE_SITE'



// actionCreators
export function addGene(
    { ensemblId, geneSymbol = "", geneExpr = {}, exonExpr = {} }: geneEntity){
    return {
        type: ADD_GENE,
        ensemblId,
        geneSymbol,
        geneExpr, 
        exonExpr
    }
}

export function addGenePanel(
    { genePanelId, panelGenes = [] }: genePanelEntity) {
    return {
        type: ADD_GENE_PANEL,
        genePanelId,
        panelGenes
    }
}

export function addTissueSite({ tissueSiteId }: tissueSiteEntity) {
    return {
        type: ADD_TISSUE_SITE,
        tissueSiteId
    }
}


export function selectGenePanel(genePanelId: string){
    return {
        type: SELECT_GENE_PANEL,
        genePanelId
    }
}

export function toggleGene(ensemblId: string) {
    return {
        type: TOGGLE_GENE,
        ensemblId
    }
}

export function toggleTissueSite(tissueSite: string) {
    return {
        type: TOGGLE_TISSUE_SITE,
        tissueSite
    }
}

