import { connect } from "react-redux";
import * as d3 from "d3";

import {
  addGene,
  addGenePanel,
  addTissueSite,
  selectGenePanel,
  toggleGene,
  toggleTissueSite
} from "../reducers/Actions";
import GeneBoxPlot from "../components/GeneBoxPlot";
import { isNonEmptyArray } from "../utils/Utils";
import { getGeneEntityByIdList } from "../store/Query";
import { geneEntity, stateInterface } from "../Interfaces";

/* 
    Formats gene expression data for scatter plotting
    Returns data: {
        <tissueSite>: [ ...[exonNum, [ ... readCounts ]]  ],
        ...
    }
*/
const formatScatterPlotData = geneEntities => {
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

/* 
  Computs summary statistics for box plotting 
  Return data: [
    ...,
    {
      x,              // x value
      i,              // index to number of selected gene/tissue
      firstQuartile,  // first quartile y-value 
      median,         // median y-value
      thirdQuartile,  // third quartile y-value
      iqr,            // inter-quartile range
      upperWhisker,   
      lowerWhisker,
      outliers,       // data points lying outside of upper/lower whiskers
    }
  ]
  */
const formatBoxPlotData = geneEntities => {
  let data = [];

  geneEntities.forEach((geneEntity, i) => {
    Object.keys(geneEntity.geneExpr).map(tissue => {
      let sorted = geneEntity.geneExpr[tissue].sort(d3.ascending);

      let min = sorted[0];
      let firstQuartile = d3.quantile(sorted, 0.25);
      let median = d3.quantile(sorted, 0.5);
      let thirdQuartile = d3.quantile(sorted, 0.75);
      let max = sorted[sorted.length - 1];
      let iqr = thirdQuartile - firstQuartile;
      let upperWhisker = d3.min([max, thirdQuartile + iqr]);
      let lowerWhisker = d3.max([min, firstQuartile - iqr]);

      let outliers = [];

      let index = 0;
      while (index++ < sorted.length) {
        if (sorted[index] >= firstQuartile - 1.5 * iqr) {
          upperWhisker = sorted[index];
          break;
        } else {
          outliers.push(sorted[index]);
        }
      }
      index = sorted.length - 1;
      while (index-- >= 0) {
        if (sorted[index] <= thirdQuartile + 1.5 * iqr) {
          upperWhisker = sorted[index];
          break;
        } else {
          outliers.push(sorted[index]);
        }
      }
      data.push({
        x: tissue,
        ensemblId: geneEntity.ensemblId,
        i,
        firstQuartile,
        median,
        thirdQuartile,
        iqr,
        upperWhisker,
        lowerWhisker,
        outliers
      });
    });
  });

  return data;
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

  let data = [];
  let geneEntities = getGeneEntityByIdList(gene, selectedGene); // defaults to []

  /* 
        Precondition for computing data for gene expression plot 
        -- select.gene array non empty and query for exonExpr in entities yield valid result
        -- select.genePanel
    */
  if (selectedGenePanel !== "" && isNonEmptyArray(geneEntities)) {
    data = formatBoxPlotData(geneEntities);

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

      let box = svg
        .selectAll("." + plotName + "_box")
        .data(data)
        .enter()
        .append("g")
        .classed(plotName + "_box", true)
        .attr("transform", "translate(" + x.bandwidth() / 2 + ",0)"); //.. not aligned properly so have to hard code a fix

      let xGroupingWidth = x.bandwidth() * xGroupingWidthRatio;
      let xGroupingWidthPer = xGroupingWidth / numPerTick;
      let xTicOffset = index =>
        numPerTick === 1
          ? 0
          : xGroupingWidth * (index / (numPerTick - 1) - 0.5);

      box
        .append("line")
        .attr("class", plotName + "_upperWhisker")
        .attr("x1", d => x(d.x) + xTicOffset(d.i) - xGroupingWidthPer / 2)
        .attr("x2", d => x(d.x) + xTicOffset(d.i) + xGroupingWidthPer / 2)
        .attr("y1", d => y(d.upperWhisker))
        .attr("y2", d => y(d.upperWhisker))
        .style("stroke", "lightgrey");

      box
        .append("line")
        .attr("class", plotName + "_lowerWhisker")
        .attr("x1", d => x(d.x) + xTicOffset(d.i) - xGroupingWidthPer / 2)
        .attr("x2", d => x(d.x) + xTicOffset(d.i) + xGroupingWidthPer / 2)
        .attr("y1", d => y(d.lowerWhisker))
        .attr("y2", d => y(d.lowerWhisker))
        .style("stroke", "lightgrey");

      box
        .append("line")
        .attr("class", plotName + "_median")
        .attr("x1", d => x(d.x) + xTicOffset(d.i) - xGroupingWidthPer / 2)
        .attr("x2", d => x(d.x) + xTicOffset(d.i) + xGroupingWidthPer / 2)
        .attr("y1", d => y(d.median))
        .attr("y2", d => y(d.median))
        .style("stroke", "black");

      box
        .append("line")
        .attr("class", plotName + "_whiskerDash")
        .attr("x1", d => x(d.x) + xTicOffset(d.i))
        .attr("x2", d => x(d.x) + xTicOffset(d.i))
        .attr("y1", d => y(d.lowerWhisker))
        .attr("y2", d => y(d.upperWhisker))
        .style("stroke", "lightgrey");

      box
        .append("rect")
        .attr("class", plotName + "_boxRect")
        .attr("stroke", "lightgrey")
        .attr("fill", d => color(d.ensemblId))
        .attr("x", d => x(d.x) + xTicOffset(d.i) - xGroupingWidthPer / 2)
        .attr("y", d => y(d.thirdQuartile))
        .attr("width", xGroupingWidthPer)
        .attr("height", d => y(d.firstQuartile) - y(d.thirdQuartile));
    }
  };
};

// receives dispath() function and returns callback props for injection
const mapDispatchToProps = dispatch => {
  return {};
};

const GeneBoxPlotContainer = connect(mapStateToProps, mapDispatchToProps)(
  GeneBoxPlot
);

export default GeneBoxPlotContainer;
