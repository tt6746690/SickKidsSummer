import * as React from "react"
import * as d3 from "d3"

import { PanelGroup, Panel } from 'react-bootstrap'

import { isEmptyObject } from "../utils/Utils"
import { tissueSiteEntity } from "../Interfaces"


interface stateInterface {
    svg: any
}

class GeneBarPlot extends React.Component<any, stateInterface>{

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
            data, geneEntities, geneNum, tissueTypes, xGroupingWidthRatio } = this.props

        console.log("zoomhandler", this.props)

        let svg: any = this.state.svg

        console.log(x)

        let rescaledY = d3.event.transform.rescaleY(y)

        svg.select(".y.axis").call(yAxis.scale(rescaledY))


        Object.keys(data).map((ensemblId, index) => {

            let xGroupingWidth = x(tissueTypes[0]) * xGroupingWidthRatio
            let xTicOffset = (geneNum == 1) ? 0 : xGroupingWidth * (index / (geneNum - 1) - 0.5)

            svg.selectAll(".geneExpr_" + index)
                .attr("transform", (d) => {
                    /* handles situation where counts = 0, log scale -> Infinity */
                    let ytrans = (d[1] == 0) ? rescaledY(0.01) : rescaledY(d[1])
                    return "translate(" + (x(d[0]) + xTicOffset + x.bandwidth()) + "," + ytrans + ")"
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

        let svg = d3.select("#GeneBarPlot")
            .append("svg")
            .attr('width', width)
            .attr('height', height)
            .append("g")
            .attr("transform", "translate(" + offset + "," + offset + ")")
            .classed("GeneBarPlotGroup", true)

        this.setState({ svg: svg })
    }

    /*
        Removes all dom element under 
        -- .ExonBarPlotGroup everytime before update 
        -- svg everytime component unmounted
    */
    tearDown = () => {
        d3.select(".GeneBarPlotGroup").selectAll("*").remove()
        d3.select("#GeneBarPlot").select("svg").on(".zoom", null)
    }

    cleanup = () => {
        d3.select("#GeneBarPlot").selectAll("*").remove()

    }

    /* 
        Plotting 
        -- x and y axis
        -- datapoints of read counts by tissueSite
    */
    plot = () => {

        let { x, y, offset, xAxis, yAxis, xAxisLength, yAxisLength,
            xLabel, yLabel, width, height, color, geneNum, 
            data, geneEntities, tissueTypes, tissueNum, xGroupingWidthRatio } = this.props
        let svg: any = this.state.svg

        console.log("plotting...", this.props)

        d3.select("#GeneBarPlot").select("svg")
            .call(d3.zoom()
                .scaleExtent([0, 100])
                .on("zoom", this.zoomHandler))

        svg.append("g")
            .classed("x axis", true)
            .attr("transform", "translate(0," + yAxisLength + ")")
            .call(xAxis)
        .selectAll("text")
            .attr("dy", ".30em")
            .attr("x", 5)
            .attr("transform", "rotate(30)")
            .style("text-anchor", "start")
        .append("text")
            .classed("label", true)
            .attr("x", xAxisLength / 2)
            .attr("y", offset * 0.7)
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
            .attr("y", -offset * 0.7)
            .style("fill", "darkgray")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .text(yLabel)

        Object.keys(data).map((ensemblId, index) => {
            /*  index/tissueNum \in [0, 1]
                index/tissueNum - 0.5 \in [-0.5, 0.5]
                scaled to xGroupingWidth to compute the xTicOffset
            */
            let xGroupingWidth = x(tissueTypes[0]) * xGroupingWidthRatio
            let xTicOffset = (geneNum == 1) ? 0 : xGroupingWidth * (index / (geneNum - 1) - 0.5)

            svg.selectAll(".geneExpr_" + index)
                .data(data[ensemblId])
                .enter().append("circle")
                .classed("dot", true)
                .classed("geneExpr_" + index, true)
                .attr("r", 2)
                .attr("transform", (d) => {
                    /* handles situation where counts = 0, log scale -> Infinity */
                    let ytrans = (d[1] == 0) ? y(0.01) : y(d[1])
                    return "translate(" + (x(d[0]) + xTicOffset + x.bandwidth()) + "," + ytrans + ")"
                })
                .style("fill", (d) => color(ensemblId))

        })


    }

    componentDidMount() { this.setup() }
    componengDidUnmount() { this.cleanup() }

    componentWillUpdate() {
        this.tearDown()
    }

    componentDidUpdate() {
        // drawing the plots
        let { data } = this.props
        if (typeof data !== "undefined" && !isEmptyObject(data)) {
            this.plot()
        }
    }


    render() {
        return (
            <div id="GeneBarPlot" />
        )
    }
}

export default GeneBarPlot