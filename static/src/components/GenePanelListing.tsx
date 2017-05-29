import * as React from "react"

import { DropdownButton, MenuItem } from 'react-bootstrap'


class GenePanelListing extends React.Component<any, any>{

    render(){
        const panelListing = this.props.panelListing.map((panel, index) =>
            <MenuItem eventKey={panel.genePanelId} 
                      key={index.toString()}
                      active={this.props.selectedGenePanel === panel.genePanelId}>
                {panel.genePanelId}
            </MenuItem>
        )
        return (
            <DropdownButton title="Gene Panels" 
                            id="bg-nested-dropdown" 
                            onSelect={this.props.genePanelSelect}>
                {panelListing}
            </DropdownButton>
        )
    }
}


export default GenePanelListing