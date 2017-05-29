import * as React from "react"
import * as d3 from "d3" 
// import { scaleLinear } from "d3-scale";

import { PanelGroup, Panel } from 'react-bootstrap'


class BarPlot extends React.Component<any, any>{

    constructor(props){
        super(props)
        this.state = this.getConfig()
    }

    getConfig = () => {
        let width = 945
        let height = 600

        let x = d3.scaleLinear().range([0, width]).nice()
        let y = d3.scaleLinear().range([0, height]).nice()

        let xAxis = d3.axisBottom(x).ticks(1)
        let yAxis = d3.axisLeft(y).ticks(10)

        return {
            width, 
            height, 
            x, 
            y,
            xAxis, 
            yAxis
        }
    }

    componentDidMount(){

        let svg = d3.select("#barplot")
                .append("svg")
                    .attr('width', this.state.width)
                    .attr('height', this.state.height)
                .append("g")

        svg.append("rect")
            .attr("width", this.state.width)
            .attr("height", this.state.height)

        svg.append("g")
                .classed("x axis", true)
                .attr("transform", "translate(0," + this.state.height + ")")
                .call(this.state.xAxis)
            .append("text")
                .classed("label", true)
                .attr("x", this.state.width / 2)
                .text("exonExpr")

        svg.append("g")
            .classed("y axis", true)
                .call(this.state.yAxis)
            .append("text")
                .classed("label", true)
                .attr("transform", "rotate(-90)")
                .attr("y", this.state.height / 2)
                .text("Read Counts")

        this.setState({
            ...this.state,
            svg
        })

    }

    render(){
        return (
            <div id="barplot"></div>
        )
    }
}

export default BarPlot