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

    /* 
        Set up 
        -- toplevel svg, g 
        -- perform appropriate transformation 
        -- global even hanlder
    */
    setup = () => {

        let { width, height, offset, x, y, zoomListener } = this.props

        let svg = d3.select("#ExonBarPlot")
            .append("svg")
                .attr('width', width)
                .attr('height', height)
            .append("g")
                .attr("transform", "translate(" + offset + "," + offset + ")")
                .classed("ExonBarPlotGroup", true)
            .call(zoomListener);
        
        this.setState({ svg: svg })
    }

    zoom = () => {
        console.log(alert("zooming"))

        let { x, y, offset, xAxis, yAxis, yAxisLength, width, height, color,
            data, geneEntities, exonNum, tissueNum, xGroupingWidth } = this.props

        let svg: any = this.state.svg

        Object.keys(data).map((dataByTissue, index) => {
            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);

            let xTicOffset = (tissueNum == 1) ? 0 : xGroupingWidth * (index / (tissueNum - 1) - 0.5)

            svg.selectAll(".dot")
                .attr("transform", (d) => {
                    return "translate(" + (x(d[0]) + xTicOffset) + "," + y(d[1]) + ")"
                })
        })
    }

    /*
        Removes all dom element under 
        -- .ExonBarPlotGroup everytime before update 
        -- svg everytime component unmounted
    */
    tearDown = () => {
        d3.select(".ExonBarPlotGroup").selectAll("*").remove()
    }

    cleanup = () => {
        d3.select("#ExonBarPlot").selectAll("*").remove()
    }

    /* 
        Plotting 
        -- x and y axis
        -- datapoints of read counts by tissueSite
    */
    plot = () => {
        
        let { x, y, offset, xAxis, yAxis, yAxisLength, width, height, color,
            data, geneEntities, exonNum, tissueNum, xGroupingWidth } = this.props
        let svg: any = this.state.svg 

        console.log("plotting...", this.props)

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

        svg.append("line")
            .classed("ExpressionCutOffLine", true)
            .attr("x1", x(0))
            .attr("y1", y(20))
            .attr("x2", x(exonNum + 1))
            .attr("y2", y(20))
            .style("stroke", "darkgray")
            .style("stroke-dasharray", ("3, 3"))

        Object.keys(data).map((dataByTissue, index) => {
            /*  index/tissueNum \in [0, 1]
                index/tissueNum - 0.5 \in [-0.5, 0.5]
                scaled to xGroupingWidth to compute the xTicOffset
            */
            let xTicOffset = (tissueNum == 1) ? 0: xGroupingWidth * (index / (tissueNum - 1) - 0.5)

            svg.selectAll(".dot")
                .data(data[dataByTissue])
                .enter().append("circle")
                .classed("dot", true)
                .attr("r", 2)
                .attr("transform", (d) => {
                    return "translate(" + (x(d[0]) + xTicOffset ) + "," + y(d[1]) + ")"
                })
                .style("fill", (d) => color(index))
            
           
        })

        
    }

    componentDidMount(){ this.setup() }
    componengDidUnmount(){ this.cleanup() }

    componentWillUpdate(){
        this.tearDown()
    }

    componentDidUpdate(){
        // drawing the plots
        let { data } = this.props
        if (typeof data !== "undefined" && !isEmptyObject(data)) {
            this.plot()
        }
    }
    
 
    render(){
        return (
            <div id="ExonBarPlot" />
        )
    }
}

export default ExonBarPlot