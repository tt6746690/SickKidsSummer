import * as React from "react"

import { DropdownButton, MenuItem } from 'react-bootstrap'

class TissueSiteListing extends React.Component<any, any>{

    render() {
        const tissueSiteList = this.props.tissueSiteListing.map((tissue, index) =>
            <MenuItem eventKey={tissue.tissueSiteId} key={index.toString()}>
                {tissue.tissueSiteId}
            </MenuItem>
        )
        return (
            <DropdownButton title="Tissue Types" id="bg-nested-dropdown" onSelect={this.props.tissueSiteSelect}>
                {tissueSiteList}
            </DropdownButton>
        )
    }
}

export default TissueSiteListing