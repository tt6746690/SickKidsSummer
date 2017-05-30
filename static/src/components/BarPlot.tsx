import * as React from "react"
import * as d3 from "d3" 
// import { scaleLinear } from "d3-scale";

import { PanelGroup, Panel } from 'react-bootstrap'

import { getGeneEntityById, getGeneEntityByIdList, isNonEmptyArray } from "../utils/Utils"
import { tissueSiteEntity } from "../Interfaces"


class BarPlot extends React.Component<any, any>{

    constructor(props){
        super(props)
        this.state = this.getConfig()
    }

    getConfig = () => {
        let width = 945
        let height = 645
        let offset = 40

        let xAxisLength = width - offset * 2
        let YAxisLength = height - offset * 2

        let x = d3.scaleLinear().range([0, xAxisLength]).nice().domain([0, 7])
        let y = d3.scaleLinear().range([YAxisLength, 0]).nice().domain([0, 300])

        let xAxis = d3.axisBottom(x).ticks(8)
        let yAxis = d3.axisLeft(y).ticks(10)

        let color = d3.scaleOrdinal(d3.schemeCategory10);

        return {
            width, height, x, y, xAxis, yAxis, offset, color
        }
    }

    componentDidMount(){

        let svg = d3.select("#barplot")
                .append("svg")
                    .attr('width', this.state.width)
                    .attr('height', this.state.height)
                .append("g")

        svg.append("g")
                .classed("x axis", true)
                .attr("transform", "translate(" + 
                    this.state.offset + "," + 
                    (this.state.height - this.state.offset) + ")")
                .call(this.state.xAxis)
            .append("text")
                .classed("label", true)
                .attr("x", this.state.width / 2)
                .attr("y", -10)
                .text("exonExpr")

        svg.append("g")
            .classed("y axis", true)
                .attr("transform", "translate(" + 
                    this.state.offset + ", "+ 
                    this.state.offset +")")
                .call(this.state.yAxis)
            .append("text")
                .classed("label", true)
                .attr("transform", "rotate(-90)")
                .attr("x", 10)
                .attr("y", this.state.height / 2)
                .text("Read Counts")

        this.setState({
            ...this.state,
            svg
        })

    }


    flattenExonExprByTissueList = (exonExpr: Object, tissues: string[]) => {

        let flattened = {}
    
        let tissue
        tissues.forEach((tissue: string) => {

            flattened[tissue] = []
            Object.keys(exonExpr).forEach((exonNum: string) => {

                let reads = exonExpr[exonNum][tissue]
                reads.map((read) => {
                    flattened[tissue].push([parseInt(exonNum), read])
                })
            })

        })

        return flattened
    }

    render(){

        let svg = this.state.svg

        console.log("rendering barplot...")


        /* 
            Precondition for displaying exon expression plot 
            -- select.gene array non empty and query for exonExpr in entities yield valid result
            -- select.tissueSite array non empty
            -- select.genePanel
            Returns data: {
                <tissueSite>: [ ...[exonNum, [ ... readCounts ]]  ],
                ...
            }
        */
        let genes = getGeneEntityByIdList(this.props.gene, this.props.selectedGene)

        if (this.props.selectedGenePanel !== "" && 
            isNonEmptyArray(genes) && 
            isNonEmptyArray(this.props.selectedTissueSite)){

            let data = this.flattenExonExprByTissueList(
                genes[genes.length - 1].exonExpr,
                this.props.selectedTissueSite)

            let tissueNum = this.props.selectedTissueSite.length

            Object.keys(data).map((dataByTissue, index) => {

                let className = "dp-" + dataByTissue.replace(/\s+/g, '-')
                svg.selectAll("." + className)
                        .data(data[dataByTissue])
                    .enter().append("circle")
                        .classed(className, true)
                        .attr("r", 2)
                        .attr("transform", (d) => {
                            return "translate(" + this.state.x(d[0] + index / tissueNum) + "," + this.state.y(d[1]) + ")"
                        })
                        .style("fill", (d) => this.state.color(index))
                        
            })
            
         
        }
        

    

        



        return (
            <div> 
                <div>
                    {genes.map((gene, index) => 
                        (<p key={index.toString()}> {gene.geneSymbol} </p>))}
                </div>
                <div> 
                    {this.props.selectedTissueSite.map((tissueId, index) => {
                        return (<p key={index.toString()}> {tissueId} </p>)   
                    })}
                </div>
                <div id="barplot"/>
            </div>
        )
    }
}

export default BarPlot