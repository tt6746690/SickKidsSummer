import { connect } from "react-redux";
import * as d3 from "d3";

import ExonBarPlot from "../components/ExonBarPlot";
import { isNonEmptyArray, log } from "../utils/Utils";
import { getGeneEntityByIdList } from "../store/Query";
import { geneEntity, stateInterface } from "../Interfaces";
import {
  addGene,
  addGenePanel,
  addTissueSite,
  selectGenePanel,
  toggleGene,
  toggleTissueSite
} from "../reducers/Actions";

/* 
    Formats exon expression data for plotting 
    Returns data: {
            <tissueSite>: [ ...[exonNum, [ ... readCounts ]]  ],
            ...
        } 
*/
const formatDataforPlot = (exonExpr: Object, tissues: string[]) => {
  let flattened = {};
  let tissue;

  tissues.forEach((tissue: string) => {
    flattened[tissue] = [];
    Object.keys(exonExpr).forEach((exonNum: string) => {
      let reads = exonExpr[exonNum][tissue];
      reads.map(read => {
        flattened[tissue].push([parseInt(exonNum), read]);
      });
    });
  });

  return flattened;
};

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, genePanel, tissueSite },
    ui: {
      select: {
        gene: selectedGene,
        genePanel: selectedGenePanel,
        tissueSite: selectedTissueSite
      },
      plot: { color, width, height, offset }
    }
  } = state;

  // plot config
  let plotName = "ExonBarPlot";
  let xLabel = "Exon Number";
  let yLabel = "Raw Read Counts (log scaled)";

  let svg = d3.select("." + plotName + "Group");

  let xAxisLength = width - offset * 2;
  let yAxisLength = height - offset * 4;

  let x = d3.scaleLinear().range([0, xAxisLength]).nice();
  let y = d3.scaleLog().range([yAxisLength, 0]).base(10);

  let xAxis = d3.axisBottom(x);
  let yAxis = d3.axisLeft(y).tickFormat(d3.format(".5"));

  let numPerTick = selectedTissueSite.length;
  let xGroupingWidthRatio = 0.4;

  let xTicks: number[];
  let xTickCount = 0;

  let data = {};
  let geneEntities = getGeneEntityByIdList(gene, selectedGene); // defaults to []

  /* 
        Precondition for computing data for exon expression plot 
        -- select.gene array non empty and query for exonExpr in entities yield valid result
        -- select.tissueSite array non empty
        -- select.genePanel
    */
  if (
    selectedGenePanel !== "" &&
    isNonEmptyArray(selectedGene) &&
    isNonEmptyArray(selectedTissueSite)
  ) {
    let lastGeneClicked = geneEntities[geneEntities.length - 1];

    data = formatDataforPlot(lastGeneClicked.exonExpr, selectedTissueSite);

    xTicks = Object.keys(lastGeneClicked.exonExpr).map(x => parseInt(x));
    xTickCount = xTicks.length;

    x.domain([0, xTickCount + 1]);
    y.domain([0.01, 10000]);

    xAxis.tickValues(xTicks);
    yAxis.tickValues([0.01, 0.1, 1, 10, 100, 1000, 10000]);

    log({ xTicks, xTickCount, data });
  }

  /*
        zoomHandler 
        -- updates x, y scale 
        -- updated x, y scale reflected in 
        ---- expression cutoff line 
        ---- x, y axis 
        ---- position of data points 
    */
  const zoomHandler = () => {
    console.log("zoomHanlder");

    let rescaledY = d3.event.transform.rescaleY(y);
    svg.select(".y.axis").call(yAxis.scale(rescaledY));

    svg
      .select(".ExpressionCutOffLine")
      .attr("x1", x(0))
      .attr("y1", rescaledY(20))
      .attr("x2", x(xTickCount + 1))
      .attr("y2", rescaledY(20));

    Object.keys(data).map((id, index) => {
      let xGroupingWidth = x(1) * xGroupingWidthRatio;
      let xTicOffset = numPerTick == 1
        ? 0
        : xGroupingWidth * (index / (numPerTick - 1) - 0.5);

      svg.selectAll("." + plotName + index).attr("transform", d => {
        let ytrans = d[1] == 0 ? rescaledY(0.01) : rescaledY(d[1]);
        return "translate(" + (x(d[0]) + xTicOffset) + "," + ytrans + ")";
      });
    });
  };

  return {
    svg,
    data,
    /* 
        Set up 
        -- toplevel svg, g 
        -- perform appropriate transformation 
        -- global event handler 
        ---- zoom
        */
    setup: () => {
      svg = d3
        .select("#" + plotName)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + offset + "," + offset + ")")
        .classed(plotName + "Group", true);
    },
    /*
        Removes all dom element under 
        -- .ExonBarPlotGroup everytime before update 
        -- svg everytime component unmounted
    */
    tearDown: () => {
      d3.select("." + plotName + "Group").selectAll("*").remove();
      d3.select("#" + plotName).select("svg").on(".zoom", null);
    },
    cleanUp: () => {
      d3.select("#" + plotName).selectAll("*").remove();
    },

    /* 
        Plotting 
        -- x and y axis
        -- datapoints of read counts by tissueSite
    */
    plot: () => {
      d3
        .select("#" + plotName)
        .select("svg")
        .call(d3.zoom().scaleExtent([0, 100]).on("zoom", zoomHandler));

      svg
        .append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + yAxisLength + ")")
        .call(xAxis)
        .append("text")
        .classed("label", true)
        .attr("x", xAxisLength / 2)
        .attr("y", offset * 0.7)
        .style("fill", "darkgray")
        .style("text-anchor", "middle")
        .style("font-size", "15px")
        .text(xLabel);

      svg
        .append("g")
        .classed("y axis", true)
        .attr("transform", "translate(0, 0)")
        .call(yAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("x", -yAxisLength / 2)
        .attr("y", -offset * 0.7)
        .style("fill", "darkgray")
        .style("text-anchor", "middle")
        .style("font-size", "15px")
        .text(yLabel);
      svg
        .append("line")
        .classed("ExpressionCutOffLine", true)
        .attr("x1", x(0))
        .attr("y1", y(20))
        .attr("x2", x(xTickCount + 1))
        .attr("y2", y(20))
        .style("stroke", "darkgray")
        .style("stroke-dasharray", "3, 3");

      Object.keys(data).map((id, index) => {
        /*  index/tissueNum \in [0, 1]
            index/tissueNum - 0.5 \in [-0.5, 0.5]
            scaled to xGroupingWidth to compute the xTicOffset
        */
        let xGroupingWidth = x(xTicks[0]) * xGroupingWidthRatio;
        let xTicOffset = numPerTick == 1
          ? 0
          : xGroupingWidth * (index / (numPerTick - 1) - 0.5);

        svg
          .selectAll("." + plotName + index)
          .data(data[id])
          .enter()
          .append("circle")
          .classed("dot", true)
          .classed(plotName + index, true)
          .attr("r", 2)
          .attr("transform", d => {
            /* handles situation where counts = 0, log scale -> Infinity */
            let ytrans = d[1] == 0 ? y(0.01) : y(d[1]);
            // console.log(x(d[0]), xTicOffset);
            return "translate(" + (x(d[0]) + xTicOffset) + "," + ytrans + ")";
          })
          .style("fill", d => color(id));
      });
    }
  };
};

// receives dispath() function and returns callback props for injection
const mapDispatchToProps = dispatch => {
  return {};
};

const ExonBarPlotContainer = connect(mapStateToProps, mapDispatchToProps)(
  ExonBarPlot
);

export default ExonBarPlotContainer;
