import { connect } from 'react-redux'
import * as d3 from "d3" 

import ExonBarPlot from '../components/ExonBarPlot'
import { isNonEmptyArray } from "../utils/Utils"
import { getGeneEntityByIdList } from "../store/Query"
import { geneEntity, stateInterface } from '../Interfaces'
import {
    addGene, addGenePanel, addTissueSite,
    selectGenePanel, toggleGene, toggleTissueSite
} from '../reducers/Actions'


const flattenExonExprByTissueList = (exonExpr: Object, tissues: string[]) => {

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



const mapStateToProps = (state: stateInterface) => {

    // destructuring state 
    let {
        entities: {
            gene,
            genePanel, 
            tissueSite
        },
        ui: {
            select: {
                gene: selectedGene,
                genePanel: selectedGenePanel,
                tissueSite: selectedTissueSite
            },
            plot: {
                color
            }
        }
    } = state

    // plot config
    let width = 945
    let height = 645
    let offset = 80

    let xAxisLength = width - offset * 2
    let yAxisLength = height - offset * 2

    let x = d3.scaleLinear().range([0, xAxisLength]).nice()
    let y = d3.scaleLog().range([yAxisLength, 0]).base(10)

    let xAxis = d3.axisBottom(x)
    let yAxis = d3.axisLeft(y).tickFormat(d3.format(".5"))

    let xLabel = "Exon Number"
    let yLabel = "Raw Read Counts (log scaled)"

    // data & data-specific config 
    let geneEntities = getGeneEntityByIdList(gene, selectedGene)        // defaults to []
    let tissueNum = selectedTissueSite.length                           // defaults to 0
    let exonNum = 0
    let xGroupingWidthRatio = 0.4

    /* 
        Precondition for computing data for exon expression plot 
        -- select.gene array non empty and query for exonExpr in entities yield valid result
        -- select.tissueSite array non empty
        -- select.genePanel
        Returns data: {
            <tissueSite>: [ ...[exonNum, [ ... readCounts ]]  ],
            ...
        } if precondition met, empty object {} otherwise
    */
    let data = {}                                                       // defaults to {}
    if (selectedGenePanel !== "" && 
        isNonEmptyArray(selectedGene) && 
        isNonEmptyArray(selectedTissueSite)) {

        let lastGeneClicked = geneEntities[geneEntities.length - 1]
        data = flattenExonExprByTissueList( 
            lastGeneClicked.exonExpr, 
            selectedTissueSite)
        
        let exons = Object.keys(lastGeneClicked.exonExpr).map(x => parseInt(x))
        exonNum = exons.length

        x.domain([0, exonNum + 1])
        y.domain([0.01, 10000])     // later change the upper y limit to reflect data

        xAxis.tickValues(exons);
        yAxis.tickValues([0.01, 0.1, 1, 10, 100, 1000, 10000])
    }

    return {
        width, height, x, y, xAxisLength, yAxisLength, xAxis, yAxis, 
        xLabel, yLabel, offset, color,
        geneEntities, data, tissueNum, exonNum, xGroupingWidthRatio
    }
}

// receives dispath() function and returns callback props for injection
const mapDispatchToProps = (dispatch) => {
    return {}
}


const ExonBarPlotContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ExonBarPlot)

export default ExonBarPlotContainer