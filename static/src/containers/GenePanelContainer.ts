import { connect } from 'react-redux'

import GenePanel from '../components/GenePanel'

import { stateInterface } from '../interfaces'
import { addGene, addGenePanel, selectGenePanel, 
        toggleGene, toggleTissueSite } from '../reducers/actions'


// transform current redux store state into component props
const mapStateToProps = (state: stateInterface) => {

    console.log("mapStateToProps", state.entities.genePanel, state.entities.tissueSite)

    return {
        genePanelListing: state.entities.genePanel,
        tissueSiteListing: state.entities.tissueSite,
        panelGeneList: state.entities.gene
    }
}

// receives dispath() function and returns callback props for injection
const mapDispatchToProps = (dispatch) => {
    return {
        /*
            Selecting a gene panel triggers 3 types of actions
            -- updates currently selected gene panel in ui.select.genePanel, and 
            -- fetch gene panel data as a side effect and when on success
            ---- gene panel is added to entities.genePanel if not exist already
            ---- each gene in the gene panel is pushed to entities.gene
        */
        onGenePanelSelect: (genePanelId: string) => {

            dispatch(selectGenePanel(genePanelId))

            fetch('http://127.0.0.1:5000/api/gene_panels/' + genePanelId, { mode: 'cors' })
                .then((response) => response.json())
                .then((genePanel) => {

                    dispatch(addGenePanel({
                        genePanelId,
                        panelGenes: genePanel.map(gene => gene.ensembl_id)
                    }))

                    genePanel.map((gene) => {
                        dispatch(addGene({
                            ensemblId: gene.ensembl_id,
                            geneSymbol: gene.symbol,
                        }))
                    })
                    
                })
        },
        /*
            Selecting a tissue toggles the currently selected tissueSite
        */
        onTissueListSelect: (tissueSite: string) => {
            dispatch(toggleTissueSite(tissueSite)) 
        },

        /*
            Selecting a gene triggers 2 actions
            -- sets toggles genes in ui.select.gene 
            -- fetch geneExpr / exonExpr as a side effect and when on success
            ---- populates geneEntity.{exonExpr, geneExpr} with data
        */
        onPanelGeneClick: (evt) => {
            let ensemblId = evt.target.value

            dispatch(toggleGene(ensemblId))

            fetch('http://127.0.0.1:5000/api/exon_expr/' + ensemblId, { mode: 'cors' })
                .then((response) => response.json())
                .then((exonExpr) => {
                    dispatch(addGene({
                        ensemblId, 
                        exonExpr 
                    }))
                })
            
            // fetch on geneExpr here
        }

    }
}


const GenePanelContainer = connect(
    mapStateToProps,
    mapDispatchToProps 
)(GenePanel)

export default GenePanelContainer