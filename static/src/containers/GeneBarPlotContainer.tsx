import { connect } from 'react-redux'
import * as d3 from "d3" 

import GeneBarPlot from '../components/GeneBarPlot'
import { isNonEmptyArray } from "../utils/Utils"
import { getGeneEntityByIdList } from "../store/Query"
import { geneEntity, stateInterface } from '../Interfaces'
import {
    addGene, addGenePanel, addTissueSite,
    selectGenePanel, toggleGene, toggleTissueSite
} from '../reducers/Actions'



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
    let offset = 40

    let xAxisLength = width - offset * 2
    let yAxisLength = height - offset * 4

    let x = d3.scaleBand().range([0, xAxisLength]).paddingOuter(0.25)
    let y = d3.scaleLog().range([yAxisLength, 0]).base(10)

    let xAxis = d3.axisBottom(x)
    let yAxis = d3.axisLeft(y).tickFormat(d3.format(".5"))

    let xLabel = "Tissue Types"
    let yLabel = "Reads (rpkm)"

    // data & data-specific config 
    let geneEntities = getGeneEntityByIdList(gene, selectedGene)        // defaults to []
    let tissueNum = 0
    let xGroupingWidthRatio = 0.4
    let tissueTypes
    let geneNum = 0

    /* 
        Precondition for computing data for gene expression plot 
        -- select.gene array non empty and query for exonExpr in entities yield valid result
        -- select.genePanel
        Returns data: {
            <tissueSite>: [ ...[exonNum, [ ... readCounts ]]  ],
            ...
        } if precondition met, empty object {} otherwise
    */
    let data = {}                                                       // defaults to {}
    if (selectedGenePanel !== "" && 
        isNonEmptyArray(geneEntities)) {

        geneEntities.forEach(geneEntity => {

            data[geneEntity.ensemblId] = []

            Object.keys(geneEntity.geneExpr).map((tissue) => {
                geneEntity.geneExpr[tissue].map(rpkm => {
                    data[geneEntity.ensemblId].push(
                        [tissue, rpkm]
                    ) 
                })
            })
             
        })

        geneNum = selectedGene.length

        tissueTypes = Object.keys(geneEntities[0].geneExpr)
        tissueNum = tissueTypes.length

        x.domain(tissueTypes)
        y.domain([0.01, 10000])     // later change the upper y limit to reflect data

        xAxis.tickValues(tissueTypes);
        yAxis.tickValues([0.01, 0.1, 1, 10, 100, 1000, 10000])
    }

    return {
        width, height, x, y, xAxisLength, yAxisLength, xAxis, yAxis, 
        xLabel, yLabel, offset, color, geneNum,
        geneEntities, data, tissueNum, tissueTypes, xGroupingWidthRatio
    }
}

// receives dispath() function and returns callback props for injection
const mapDispatchToProps = (dispatch) => {
    return {}
}


const GeneBarPlotContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GeneBarPlot)

export default GeneBarPlotContainer