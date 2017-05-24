import * as React from "react"


const GenePanel = (props) => {
    <li>
        props.panelName
    </li> 
}

class GenePanelList extends React.Component<any, any>{
    
    render(){

        const genePanels = this.props.panelList.map((panel, index) =>
            <li key={index.toString()}>
                {panel}
            </li>
        )
        return (
            <ul>{genePanels}</ul>
        )
    }
}


export default GenePanelList