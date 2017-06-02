import * as React from "react"
import * as d3 from "d3" 

import { PanelGroup, Panel } from 'react-bootstrap'

import { isEmptyObject } from "../utils/Utils"
import { tissueSiteEntity } from "../Interfaces"


interface stateInterface {
    svg: any
}

class ExonBarPlot extends React.Component<any, stateInterface>{

    state = {
        svg: {}
    }

    /*
        zoomHandler 
        -- updates x, y scale 
        -- updated x, y scale reflected in 
        ---- expression cutoff line 
        ---- x, y axis 
        ---- position of data points 
    */
    zoomHandler = () => {
        let { x, y, offset, xAxis, yAxis, yAxisLength, width, height, color,
            data, geneEntities, exonNum, tissueNum, xGroupingWidthRatio } = this.props

        console.log("zoomhandler", this.props)

        let svg: any = this.state.svg

        let rescaledX = d3.event.transform.rescaleX(x)
        let rescaledY = d3.event.transform.rescaleY(y)

        svg.select(".x.axis").call(xAxis.scale(rescaledX))
        svg.select(".y.axis").call(yAxis.scale(rescaledY))

        svg.select(".ExpressionCutOffLine")
            .attr("x1", rescaledX(0))
            .attr("y1", rescaledY(20))
            .attr("x2", rescaledX(exonNum + 1))
            .attr("y2", rescaledY(20))

        Object.keys(data).map((tissue, index) => {

            let xGroupingWidth = rescaledX(1) * xGroupingWidthRatio
            let xTicOffset = (tissueNum == 1) ? 0 : xGroupingWidth * (index / (tissueNum - 1) - 0.5)

            svg.selectAll(".tissueSite_" + index)
                .attr("transform", (d) => {
                    /* handles situation where counts = 0, log scale -> Infinity */
                    let ytrans = (d[1] == 0) ? rescaledY(0.01) : rescaledY(d[1])
                    return "translate(" + (rescaledX(d[0]) + xTicOffset) + "," + ytrans + ")"
                })
        })
    }


    /* 
        Set up 
        
        -- toplevel svg, g 
        -- perform appropriate transformation 
        -- global event handler 
        ---- zoom
    */
    setup = () => {

        let { width, height, offset, x, y, xGroupingWidthRatio } = this.props

        let svg = d3.select("#ExonBarPlot")
            .append("svg")
                .attr('width', width)
                .attr('height', height)
            .append("g")
                .attr("transform", "translate(" + offset + "," + offset + ")")
                .classed("ExonBarPlotGroup", true)

        this.setState({ svg: svg })
    }

    /*
        Removes all dom element under 
        -- .ExonBarPlotGroup everytime before update 
        -- svg everytime component unmounted
    */
    tearDown = () => {
        d3.select(".ExonBarPlotGroup").selectAll("*").remove()
        d3.select("#ExonBarPlot").select("svg").on(".zoom", null)
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
        
        let { x, y, offset, xAxis, yAxis, xAxisLength, yAxisLength, 
                xLabel, yLabel, width, height, color,
                data, geneEntities, exonNum, tissueNum, xGroupingWidthRatio } = this.props
        let svg: any = this.state.svg 

        console.log("plotting...", this.props)

        d3.select("#ExonBarPlot").select("svg")
            .call(d3.zoom()
                .scaleExtent([0, 100])
                .on("zoom", this.zoomHandler))

        svg.append("g")
            .classed("x axis", true)
            .attr("transform", "translate(0," + yAxisLength + ")")
            .call(xAxis)
            .append("text")
            .classed("label", true)
            .attr("x", xAxisLength / 2)
            .attr("y", offset*0.7)
            .style("fill", "darkgray")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .text(xLabel)

        svg.append("g")
            .classed("y axis", true)
            .attr("transform", "translate(0, 0)")
            .call(yAxis)
            .append("text")
            .classed("label", true)
            .attr("transform", "rotate(-90)")
            .attr("x", - yAxisLength / 2)
            .attr("y", -offset*0.7)
            .style("fill", "darkgray")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .text(yLabel)

        svg.append("line")
            .classed("ExpressionCutOffLine", true)
            .attr("x1", x(0))
            .attr("y1", y(20))
            .attr("x2", x(exonNum + 1))
            .attr("y2", y(20))
            .style("stroke", "darkgray")
            .style("stroke-dasharray", ("3, 3"))

        Object.keys(data).map((tissue, index) => {
            /*  index/tissueNum \in [0, 1]
                index/tissueNum - 0.5 \in [-0.5, 0.5]
                scaled to xGroupingWidth to compute the xTicOffset
            */
            let xGroupingWidth = x(1) * xGroupingWidthRatio
            let xTicOffset = (tissueNum == 1) ? 0: xGroupingWidth * (index / (tissueNum - 1) - 0.5)

            svg.selectAll(".tissueSite_" + index)
                    .data(data[tissue])
                .enter().append("circle")
                    .classed("dot", true)
                    .classed("tissueSite_" + index, true)
                    .attr("r", 2)
                    .attr("transform", (d) => {
                        /* handles situation where counts = 0, log scale -> Infinity */
                        let ytrans = (d[1] == 0) ? y(0.01) : y(d[1])
                        return "translate(" + (x(d[0]) + xTicOffset ) + "," + ytrans + ")"
                    })
                    .style("fill", (d) => color(tissue))
            
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