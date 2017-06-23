import { connect } from "react-redux";
import * as d3 from "d3";

import {
  addGene,
  addGenePanel,
  addTissueSite,
  selectGenePanel,
  toggleGene,
  toggleTissueSite
} from "../reducers/EntitiesActions";
import ExonBoxPlot from "../components/ExonBoxPlot";
import { isNonEmptyArray } from "../utils/Utils";
import {
  formatExonBoxPlotData,
  formatExonScatterPlotData
} from "../utils/Plot";
import { getGeneEntityByIdList } from "../store/Query";
import { geneEntity, stateInterface } from "../Interfaces";

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
  let plotName = "ExonBoxPlot";
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

  let data = [];
  let geneEntities = getGeneEntityByIdList(gene, selectedGene); // defaults to []
  let lastGeneEntity: geneEntity = {} as geneEntity;

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
    lastGeneEntity = geneEntities[geneEntities.length - 1];

    data = formatExonBoxPlotData(lastGeneEntity.exonExpr, selectedTissueSite);

    xTicks = Object.keys(lastGeneEntity.exonExpr).map(x => parseInt(x));
    xTickCount = xTicks.length;

    x.domain([0, xTickCount + 1]);
    y.domain([1, 1000]);

    xAxis.tickValues(xTicks);
    yAxis.tickValues([1, 10, 100, 1000]);
  }

  return {
    svg,
    data,
    lastGeneEntity,
    /*
      Returns true of data is valid for plotting 
    */
    preconditionSatisfied() {
      return typeof data !== "undefined" && isNonEmptyArray(data);
    },
    /* 
        Set up 
        -- toplevel svg, g 
        -- perform appropriate transformation 
        -- global event handler 
        ---- zoom
        */
    setUp: () => {
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

      let box = svg
        .selectAll("." + plotName + "_box")
        .data(data)
        .enter()
        .append("g")
        .classed(plotName + "_box", true)
        .on("mouseover", d => {
          console.log("rect::mouseover");

          let xpos = x(d.x) + xTicOffset(d.i) + xGroupingWidthPer / 2 + "px";

          d3
            .select("." + plotName + "_tooltip_median")
            .transition()
            .duration(50)
            .style("opacity", 0.9)
            .text(d.median.toPrecision(3))
            .style("text-anchor", "begin")
            .attr("x", xpos)
            .attr("y", ysafe(d.median) + "px");

          d3
            .select("." + plotName + "_tooltip_firstQuartile")
            .transition()
            .duration(50)
            .style("opacity", 0.9)
            .text(d.firstQuartile.toPrecision(3))
            .style("text-anchor", "begin")
            .attr("x", xpos)
            .attr("y", ysafe(d.firstQuartile) + "px");

          d3
            .select("." + plotName + "_tooltip_thirdQuartile")
            .transition()
            .duration(50)
            .style("opacity", 0.9)
            .text(d.thirdQuartile.toPrecision(3))
            .style("text-anchor", "begin")
            .attr("x", xpos)
            .attr("y", ysafe(d.thirdQuartile) + "px");
        })
        .on("mouseout", function(d) {
          d3
            .select("." + plotName + "_tooltip_median")
            .transition()
            .duration(50)
            .style("opacity", 0);

          d3
            .select("." + plotName + "_tooltip_firstQuartile")
            .transition()
            .duration(50)
            .style("opacity", 0);

          d3
            .select("." + plotName + "_tooltip_thirdQuartile")
            .transition()
            .duration(50)
            .style("opacity", 0);
        });

      let xGroupingWidth = x(xTicks[0]) * xGroupingWidthRatio;
      let xGroupingWidthPer = xGroupingWidth / numPerTick;
      let xTicOffset = index =>
        numPerTick === 1
          ? 0
          : xGroupingWidth * (index / (numPerTick - 1) - 0.5);

      let ysafe = val => {
        return val < 1 ? y(1) : y(val);
      };

      box
        .append("line")
        .attr("class", plotName + "_upperWhisker")
        .attr("x1", d => x(d.x) + xTicOffset(d.i) - xGroupingWidthPer / 2)
        .attr("x2", d => x(d.x) + xTicOffset(d.i) + xGroupingWidthPer / 2)
        .attr("y1", d => ysafe(d.upperWhisker))
        .attr("y2", d => ysafe(d.upperWhisker))
        .style("stroke", "lightgrey");

      box
        .append("line")
        .attr("class", plotName + "_lowerWhisker")
        .attr("x1", d => x(d.x) + xTicOffset(d.i) - xGroupingWidthPer / 2)
        .attr("x2", d => x(d.x) + xTicOffset(d.i) + xGroupingWidthPer / 2)
        .attr("y1", d => ysafe(d.lowerWhisker))
        .attr("y2", d => ysafe(d.lowerWhisker))
        .style("stroke", "lightgrey");

      box
        .append("line")
        .attr("class", plotName + "_whiskerDash")
        .attr("x1", d => x(d.x) + xTicOffset(d.i))
        .attr("x2", d => x(d.x) + xTicOffset(d.i))
        .attr("y1", d => ysafe(d.lowerWhisker))
        .attr("y2", d => ysafe(d.upperWhisker))
        .style("stroke", "lightgrey");

      box
        .append("rect")
        .attr("class", plotName + "_boxRect")
        .attr("stroke", "lightgrey")
        .attr("fill", d => color(d.id))
        .attr("x", d => x(d.x) + xTicOffset(d.i) - xGroupingWidthPer / 2)
        .attr("y", d => ysafe(d.thirdQuartile))
        .attr("width", xGroupingWidthPer)
        .attr("height", d => ysafe(d.firstQuartile) - ysafe(d.thirdQuartile));

      box.each((d, i) => {
        if (isNonEmptyArray(d.outliers)) {
          svg
            .selectAll("." + plotName + "_outliers_" + i)
            .data(d.outliers)
            .enter()
            .append("circle")
            .attr("class", plotName + "_outliers_" + i)
            .attr("r", x(1) / 50 >= 1 ? x(1) / 50 : 1)
            .attr("cx", e => {
              return x(d.x) + xTicOffset(d.i);
            })
            .attr("cy", e => ysafe(e))
            .attr("fill", "lightgrey");
        }
      });

      box
        .append("line")
        .attr("class", plotName + "_median")
        .attr("x1", d => x(d.x) + xTicOffset(d.i) - xGroupingWidthPer / 2)
        .attr("x2", d => x(d.x) + xTicOffset(d.i) + xGroupingWidthPer / 2)
        .attr("y1", d => ysafe(d.median))
        .attr("y2", d => ysafe(d.median))
        .style("stroke", "#838383");

      svg
        .append("text")
        .attr("class", plotName + "_tooltip_median")
        .style("opacity", 0);
      svg
        .append("text")
        .attr("class", plotName + "_tooltip_thirdQuartile")
        .style("opacity", 0);
      svg
        .append("text")
        .attr("class", plotName + "_tooltip_firstQuartile")
        .style("opacity", 0);
    }
  };
};

// receives dispath() function and returns callback props for injection
const mapDispatchToProps = dispatch => {
  return {};
};

const ExonBoxPlotContainer = connect(mapStateToProps, mapDispatchToProps)(
  ExonBoxPlot
);

export default ExonBoxPlotContainer;
