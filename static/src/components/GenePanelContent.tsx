import * as React from "react"
import { ButtonGroup, Button } from "react-bootstrap"

import { isEmptyObject, isNonEmptyArray } from "../utils/Utils"
import { getGenePanelEntityById, getGeneEntityByIdList } from "../store/Query"
import { geneEntity } from "../Interfaces"


class GenePanelContent extends React.Component<any, any>{

    render() {
        /*
            Displays gene symbol associated with currently selected genePanel
            -- query entities.genePanel to get list of genes associatted with selectedGenePanel
            -- query entities.gene to get geneSymbol info for each gene
            -- map to a list of Buttons
        */
        let panelGeneButtons
        let genePanel = getGenePanelEntityById(this.props.genePanel, this.props.selectedGenePanel)

        if(!isEmptyObject(genePanel) && 
            isNonEmptyArray(genePanel.panelGenes)){

            let genes = getGeneEntityByIdList(this.props.gene, genePanel.panelGenes)

            panelGeneButtons = genes.map((gene: geneEntity, index) => {
               return (
                    <Button value={gene.ensemblId} 
                                key={index.toString()} 
                                onClick={this.props.onPanelGeneClick}
                                bsStyle={(this.props.selectedGene.includes(gene.ensemblId)) ? "success": "default"}>
                            {gene.geneSymbol.toUpperCase()}
                    </Button>
               )
            })
        }

        return (
            <ButtonGroup> 
                {panelGeneButtons}
            </ButtonGroup>
        )
    }
}


export default GenePanelContent