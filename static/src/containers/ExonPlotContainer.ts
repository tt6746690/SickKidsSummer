import { connect } from "react-redux";
import * as d3 from "d3";

import { stateInterface } from "../Interfaces";
import ExonPlot from "../components/ExonPlot";
import { getTissueRanking } from "../store/Query";

import { isNonEmptyArray } from "../utils/Utils";
import { toggleGene } from "../reducers/Actions";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, tissueSite, genePanel },
    ui: {
      select: {
        gene: selectedGene,
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

  width = 900;
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
    selectedGene,
    selectedTissueSiteLast,
    selectedRefTissueSite,
    getPlotId,
    color,
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
        .attr("fill", d => ((d as any).over ? "lightgrey" : "white"))
        .attr("x", d => x((d as any).x))
        .attr("y", 0)
        .attr("width", x(1) * xGroupingWidthRatio)
        .attr("height", height - offset);

      exonBox
        .append("text")
        .attr("class", `${getPlotId(geneSymbol)}_exonBoxText`)
        .attr("x", d => x((d as any).x))
        .attr("y", height - offset / 2)
        .style("text-anchor", "middle")
        .attr("fill", "lightgrey")
        .style(
          "font-size",
          100 / xTickCount < 8
            ? "8px"
            : 100 / xTickCount > 20 ? "20px" : 100 / xTickCount
        )
        .text(d => d.x);
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /*
        Selecting a gene
        -- sets toggles genes in ui.select.gene 
    */
    onPanelGeneClick: evt => {
      let ensemblId = evt.target.value;
      dispatch(toggleGene(ensemblId));
    }
  };
};

const ExonPlotContainer = connect(mapStateToProps, mapDispatchToProps)(
  ExonPlot
);

export default ExonPlotContainer;
