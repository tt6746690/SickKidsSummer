import { connect } from "react-redux";
import * as d3 from "d3";

import { stateInterface } from "../Interfaces";
import ExonPlot from "../components/ExonPlot";
import { getTissueRanking } from "../store/Query";

import { isNonEmptyArray } from "../utils/Utils";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, tissueSite, genePanel },
    ui: {
      select: {
        genePanel: selectedGenePanel,
        refTissueSite: selectedRefTissueSite,
        tissueSite: selectedTissueSite
      },
      plot: { color, width, height, offset }
    }
  } = state;

  const getPlotId = (geneSymbol: string) => {
    return geneSymbol + "_" + plotName;
  };

  // plot config
  let plotName = "ExonPlot";
  let svg = undefined;

  width = 700;
  height = 100;

  let xAxisLength = width - offset * 2;
  let yAxisLength = height - offset * 2;

  let x = d3.scaleLinear().range([0, xAxisLength]).nice();
  let xTickCount = 0;

  let xGroupingWidthRatio = 0.5;

  let selectedTissueSiteLast =
    selectedTissueSite[selectedTissueSite.length - 1];

  return {
    gene,
    selectedTissueSiteLast,
    getPlotId,
    preconditionSatisfied(data) {
      return isNonEmptyArray(data);
    },
    setUp(geneSymbol: string) {
      svg = d3
        .select(`#${getPlotId(geneSymbol)}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .classed(`${getPlotId(geneSymbol)}Group`, true);
    },
    tearDown: (geneSymbol: string) => {
      d3.select(`.${getPlotId(geneSymbol)}Group`).selectAll("*").remove();
    },
    cleanUp: (geneSymbol: string) => {
      d3.select(`#${getPlotId(geneSymbol)}`).selectAll("*").remove();
    },
    plot(data) {
      let { "0": { id: geneSymbol } } = data;

      xTickCount = data.length;
      x.domain([0, xTickCount + 1]);

      svg = d3.select(`.${getPlotId(geneSymbol)}Group`);

      let exonBox = svg
        .selectAll(`.${getPlotId(geneSymbol)}_exonBox`)
        .data(data)
        .enter()
        .append("g")
        .classed(`${getPlotId(geneSymbol)}_exonBox`, true);

      exonBox
        .append("rect")
        .attr("class", `${getPlotId(geneSymbol)}_exonBoxRect`)
        .attr("stroke", "lightgrey")
        .attr("fill", d => ((d as any).overByMedian ? "lightgrey" : "white"))
        .attr("x", d => x((d as any).x))
        .attr("y", 0)
        .attr("width", x(1) * xGroupingWidthRatio)
        .attr("height", height - offset);
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const ExonPlotContainer = connect(mapStateToProps, mapDispatchToProps)(
  ExonPlot
);

export default ExonPlotContainer;
