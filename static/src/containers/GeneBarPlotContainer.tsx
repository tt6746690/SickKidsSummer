import { connect } from "react-redux";
import * as d3 from "d3";

import GeneBarPlot from "../components/GeneBarPlot";
import { isNonEmptyArray } from "../utils/Utils";
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
    Formats gene expression data for plotting 
    Returns data: {
        <tissueSite>: [ ...[exonNum, [ ... readCounts ]]  ],
        ...
    }
*/
const formatDataforPlot = geneEntities => {
  let data = {};

  geneEntities.forEach(geneEntity => {
    data[geneEntity.ensemblId] = [];

    Object.keys(geneEntity.geneExpr).map(tissue => {
      geneEntity.geneExpr[tissue].map(rpkm => {
        data[geneEntity.ensemblId].push([tissue, rpkm]);
      });
    });
  });
  return data;
};

const mapStateToProps = (state: stateInterface) => {
  // destructuring state
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
  let plotName = "GeneBarPlot";
  let xLabel = "Tissue Types";
  let yLabel = "Reads (rpkm)";

  let svg = d3.select("." + plotName + "Group");

  let xAxisLength = width - offset * 2;
  let yAxisLength = height - offset * 4;

  let x = d3.scaleBand().range([0, xAxisLength]).paddingOuter(0.25);
  let y = d3.scaleLog().range([yAxisLength, 0]).base(10);

  let xAxis = d3.axisBottom(x);
  let yAxis = d3.axisLeft(y).tickFormat(d3.format(".5"));

  let numPerTick = selectedGene.length;
  let xGroupingWidthRatio = 0.4;

  let xTicks: string[];
  let xTickCount = 0;

  let data = {};
  let geneEntities = getGeneEntityByIdList(gene, selectedGene); // defaults to []

  /* 
        Precondition for computing data for gene expression plot 
        -- select.gene array non empty and query for exonExpr in entities yield valid result
        -- select.genePanel
    */
  if (selectedGenePanel !== "" && isNonEmptyArray(geneEntities)) {
    data = formatDataforPlot(geneEntities);

    xTicks = Object.keys(geneEntities[0].geneExpr);
    xTickCount = xTicks.length;

    x.domain(xTicks);
    y.domain([0.01, 10000]); // later change the upper y limit to reflect data

    xAxis.tickValues(xTicks);
    yAxis.tickValues([0.01, 0.1, 1, 10, 100, 1000, 10000]);
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

    Object.keys(data).map((id, index) => {
      let xGroupingWidth = x(xTicks[0]) * xGroupingWidthRatio;
      let xTicOffset = numPerTick == 1
        ? 0
        : xGroupingWidth * (index / (numPerTick - 1) - 0.5);

      svg.selectAll("." + plotName + index).attr("transform", d => {
        let ytrans = d[1] == 0 ? rescaledY(0.01) : rescaledY(d[1]);
        return (
          "translate(" +
          (x(d[0]) + xTicOffset + x.bandwidth()) +
          "," +
          ytrans +
          ")"
        );
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

            return (
              "translate(" +
              (x(d[0]) + xTicOffset + x.bandwidth()) +
              "," +
              ytrans +
              ")"
            );
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

const GeneBarPlotContainer = connect(mapStateToProps, mapDispatchToProps)(
  GeneBarPlot
);

export default GeneBarPlotContainer;
