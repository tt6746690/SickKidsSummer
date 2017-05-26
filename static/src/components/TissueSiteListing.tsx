import * as React from "react"

import { DropdownButton, MenuItem } from 'react-bootstrap'

class TissueSiteListing extends React.Component<any, any>{

    render() {
        const tissueSiteList = this.props.tissueSiteList.map((tissue, index) =>
            <MenuItem eventKey={tissue} key={index.toString()}>
                {tissue}
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