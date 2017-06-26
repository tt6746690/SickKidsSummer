import * as d3 from "d3";
import { connect } from "react-redux";

import ExonPlot from "../components/ExonPlot";
import { stateInterface } from "../Interfaces";
import { setGeneForPlot } from "../reducers/EntitiesActions";
import { isNonEmptyArray } from "../utils/Utils";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, tissueSite, genePanel },
    ui: {
      select: {
        gene: selectedGene,
        geneForPlot: selectedGeneForPlot,
        genePanel: selectedGenePanel,
        refTissueSite: selectedRefTissueSite,
        rankedTissueSite: selectedRankedTissueSite
      },
      plot: { color, width, height, offset }
    }
  } = state;

  const getPlotId = (geneSymbol: string, tissueSite: string) => {
    return `${tissueSite
      .split(/\s|-|\(|\)/g)
      .join("_")}_${geneSymbol}_${plotName}`;
  };

  // plot config
  let plotName = "ExonPlot";
  let svg = undefined;

  width = 900;
  height = 50;

  let xAxisLength = width - offset * 2;
  let yAxisLength = height - offset * 2;

  let x = d3.scaleLinear().range([0, xAxisLength]).nice();
  let xTickCount = 0;

  let xGroupingWidthRatio = 0.5;

  return {
    gene,
    selectedGene,
    selectedGeneForPlot,
    selectedRankedTissueSite,
    selectedRefTissueSite,
    getPlotId,
    color,
    height,
    preconditionSatisfied(data) {
      return isNonEmptyArray(data);
    },
    setUp(geneSymbol: string, tissueSite: string) {
      svg = d3
        .select(`#${getPlotId(geneSymbol, tissueSite)}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .classed(`${getPlotId(geneSymbol, tissueSite)}Group`, true);
    },
    tearDown: (geneSymbol: string, tissueSite: string) => {
      d3
        .select(`.${getPlotId(geneSymbol, tissueSite)}Group`)
        .selectAll("*")
        .remove();
    },
    cleanUp: (geneSymbol: string, tissueSite: string) => {
      d3
        .select(`#${getPlotId(geneSymbol, tissueSite)}`)
        .selectAll("*")
        .remove();
    },
    plot(data, { noXLabel } = { noXLabel: false }) {
      let { "0": { geneSymbol, tissueSite } } = data;

      /*  
        Set a maximum width on each exon rect by 
        adjusting the domain
        -- if there is few exons in the gene, then allow 
        ---- x.domain() to not reflect number of exons in the gene
        -- otherwise, i.e. many exons 
        ---- x.domain() reflects number of exons such that its possible to give 
        ---- a coordinate to every d.x
      */
      xTickCount = data.length;
      if (xTickCount <= 20) {
        x.domain([0, 20]);
      } else {
        x.domain([0, xTickCount + 1]);
      }

      svg = d3.select(`.${getPlotId(geneSymbol, tissueSite)}Group`);

      let exonBox = svg
        .selectAll(`.${getPlotId(geneSymbol, tissueSite)}_exonBox`)
        .data(data)
        .enter()
        .append("g")
        .classed(`${getPlotId(geneSymbol, tissueSite)}_exonBox`, true);

      exonBox
        .append("rect")
        .attr("class", `${getPlotId(geneSymbol, tissueSite)}_exonBoxRect`)
        .attr("stroke", "lightgrey")
        .attr(
          "fill",
          d => ((d as any).over ? color((d as any).tissueSite) : "white")
        )
        .attr("x", d => x((d as any).x))
        .attr("y", 0)
        .attr("width", x(1) * xGroupingWidthRatio)
        .attr("height", noXLabel ? height : height - offset);

      if (!noXLabel) {
        exonBox
          .append("text")
          .attr("class", `${getPlotId(geneSymbol, tissueSite)}_exonBoxText`)
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
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /*
        Selecting a gene
        -- sets toggles genes in ui.select.gene 
    */
    onModalOpen: evt => {
      let ensemblId = evt.target.value;
      dispatch(setGeneForPlot(ensemblId));
    },

    onModalClose: () => {
      dispatch(setGeneForPlot());
    }
  };
};

const ExonPlotContainer = connect(mapStateToProps, mapDispatchToProps)(
  ExonPlot
);

export default ExonPlotContainer;
