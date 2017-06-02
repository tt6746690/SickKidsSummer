import * as React from "react"
import { ButtonGroup, Button } from "react-bootstrap"

import { isEmptyObject, isNonEmptyArray } from "../utils/Utils"
import { getGenePanelEntityById, getGeneEntityByIdList } from "../store/Query"
import { geneEntity } from "../Interfaces"


class GenePanelContent extends React.Component<any, any>{

    render() {

        let { gene, genePanel, selectedGene, selectedGenePanel, color, onPanelGeneClick } = this.props
        /*
            Displays gene symbol associated with currently selected genePanel
            -- query entities.genePanel to get list of genes associatted with selectedGenePanel
            -- query entities.gene to get geneSymbol info for each gene
            -- map to a list of Buttons
        */
        let panelGeneButtons
        let genePanelEntity = getGenePanelEntityById(genePanel, selectedGenePanel)

        if (!isEmptyObject(genePanelEntity) && 
            isNonEmptyArray(genePanelEntity.panelGenes)){

            let genes = getGeneEntityByIdList(gene, genePanelEntity.panelGenes)

            panelGeneButtons = genes.map((gene: geneEntity, index) => {


                let getStyle = () => {

                    let style = {}

                    if (selectedGene.includes(gene.ensemblId)) {
                        style["backgroundColor"] = color(gene.ensemblId)
                    }

                    if (selectedGene[selectedGene.length - 1] === gene.ensemblId) {
                        style["border"] = "2px dashed black"
                        style["marginTop"] = "-1px"
                        style["marginBottom"] = "-1px"
                    }

                    return {
                        ... style
                    }
                }


               return (
                    <Button className={"panelGeneButton"}
                                value={gene.ensemblId} 
                                key={index.toString()} 
                                onClick={onPanelGeneClick}
                                style={getStyle()}>
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