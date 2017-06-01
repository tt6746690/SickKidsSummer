import * as React from "react"
import { ButtonGroup, Button } from "react-bootstrap"

class TissueSiteContent extends React.Component<any, any>{

    render() {

        let selectedTissueButtons = this.props.selectedTissueSite.map((tissueSiteId, index) => {
            return(
                <Button value={tissueSiteId}
                    key={index.toString()}
                    onClick={this.props.onTissueSiteClick}>
                    {tissueSiteId}
                </Button>
            )
        })

        return (
            <ButtonGroup>
                {selectedTissueButtons}
            </ButtonGroup>
        )
    }
}


export default TissueSiteContent