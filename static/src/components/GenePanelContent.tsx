import * as React from "react"

import { ButtonGroup, Button } from "react-bootstrap"


class GenePanelContent extends React.Component<any, any>{

    render() {
        const panelGeneList = this.props.panelGeneList.map((gene, index) =>
            <Button value={gene.ensembl_id} key={index.toString()} onClick={this.props.panelGeneClick}>
                {gene.symbol.toUpperCase()}
            </Button>
        )
        return (
            <ButtonGroup> 
                {panelGeneList}
            </ButtonGroup>
        )
    }
}


export default GenePanelContent