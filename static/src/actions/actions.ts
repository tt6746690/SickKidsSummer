
// actionTypes

// dont have to unselect, since only one genePanel is active in display
export const SELECT_GENE_PANEL = 'SELECT_GENE_PANEL'

export const TOGGLE_GENE = 'TOGGLE_GENE'

export const SELECT_TISSUE_SITE = 'SELECT_TISSUE_SITE'



// action creators return an action
export function selectGenePanel(genePanel){
    return {
        type: SELECT_GENE_PANEL,
        genePanel
    }
}


export function toggleGene(ensemblId) {
    return {
        type: TOGGLE_GENE,
        ensemblId
    }
}


export function selectTissueSite(tissueSite) {
    return {
        type: SELECT_TISSUE_SITE,
        tissueSite
    }
}

