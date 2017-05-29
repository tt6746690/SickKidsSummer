import * as React from "react"

import { ButtonGroup, Button } from "react-bootstrap"


class GenePanelContent extends React.Component<any, any>{

    render() {
        /*
            Displays gene symbol associated with currently selected genePanel
            -- query genePanelList for matching genePanelId with selectedGenePanel
            -- look up info related to gene in this.props.gene
            -- maps gene.geneSymbol to a list of Buttons
        */
        let panelGeneButtons

        // returns undefined if not found
        const filteredGenePanel = this.props.genePanelListing.find((panel) => {
            return panel.genePanelId == this.props.selectedGenePanel
        })


        if(filteredGenePanel){
            panelGeneButtons = filteredGenePanel.panelGenes.map((ensemblId, index) => {
                let geneInfo = this.props.gene.find((gene) => gene.ensemblId == ensemblId)

                if(geneInfo){
                    return (
                        <Button value={geneInfo.ensemblId} key={index.toString()} onClick={this.props.onPanelGeneClick}>
                            {geneInfo.geneSymbol.toUpperCase()}
                        </Button>
                    )
                } 
                
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