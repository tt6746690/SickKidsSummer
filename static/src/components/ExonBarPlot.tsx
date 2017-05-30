import * as React from "react"
import * as d3 from "d3" 

import { PanelGroup, Panel } from 'react-bootstrap'

import { getGeneEntityById, getGeneEntityByIdList, isNonEmptyArray, isEmptyObject } from "../utils/Utils"
import { tissueSiteEntity } from "../Interfaces"


interface stateInterface {
    svg: any
}

class ExonBarPlot extends React.Component<any, stateInterface>{

    state = {
        svg: {}
    }

    componentDidMount(){

        let { width, height, yAxisLength, offset, xAxis, yAxis } = this.props

        let svg = d3.select("#barplot")
                .append("svg")
                    .attr('width', width)
                    .attr('height', height)
                .append("g")
                    .attr("transform", "translate(" + offset + "," + offset + ")")

        this.setState({ svg: svg })

    }

    componentDidUpdate(){
        let { x, y, xAxis, yAxis, yAxisLength, width, height, color, 
            data, geneEntities, tissueNum } = this.props

        console.log("ExonBarPlot: componentWillUpdate", this.props)        

        // drawing the plots
        if (typeof data !== "undefined" && !isEmptyObject(data)) {
            Object.keys(data).map((dataByTissue, index) => {

                let svg: any = this.state.svg

                svg.append("g")
                    .classed("x axis", true)
                    .attr("transform", "translate(0," + yAxisLength + ")")
                    .call(xAxis)
                    .append("text")
                    .classed("label", true)
                    .attr("x", width / 2)
                    .attr("y", -10)
                    .text("exonExpr")

                svg.append("g")
                    .classed("y axis", true)
                    .attr("transform", "translate(0, 0)")
                    .call(yAxis)
                    .append("text")
                    .classed("label", true)
                    .attr("transform", "rotate(-90)")
                    .attr("x", 10)
                    .attr("y", height / 2)
                    .text("Read Counts")


                let className = "dp-" + dataByTissue.replace(/\s+/g, '-')

                svg.selectAll("." + className)
                    .data(data[dataByTissue])
                    .enter().append("circle")
                    .classed(className, true)
                    .attr("r", 2)
                    .attr("transform", (d) => {
                        return "translate(" + x(d[0] + index / tissueNum) + "," + y(d[1]) + ")"
                    })
                    .style("fill", (d) => color(index))
            })
        }
    }
 
    render(){

        return (
            <div id="barplot" />
        )
    }
}

export default ExonBarPlot