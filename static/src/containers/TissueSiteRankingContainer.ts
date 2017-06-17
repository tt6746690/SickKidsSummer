import { connect } from "react-redux";
import * as d3 from "d3";

import { toggleTissueSite, setViewType, VIEW_TYPE } from "../reducers/Actions";
import { stateInterface } from "../Interfaces";
import TissueSiteRanking from "../components/TissueSiteRanking";
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

  // plot config
  let plotName = "ExonPlot";
  let svg = d3.select("." + plotName + "Group");

  width = 800;
  height = 100;

  let xAxisLength = width - offset * 2;
  let yAxisLength = height - offset * 2;

  let x = d3.scaleLinear().range([0, xAxisLength]).nice();
  let xTickCount = 0;

  return {
    gene,
    plotName,
    selectedGenePanel,
    selectedRefTissueSite,
    selectedTissueSite,
    color,
    getRanking() {
      return getTissueRanking(
        genePanel,
        selectedGenePanel,
        selectedRefTissueSite
      );
    },
    setup(geneSymbol: string) {
      svg = d3
        .select("#" + geneSymbol + "_" + plotName)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + offset + "," + offset + ")")
        .classed(geneSymbol + "_" + plotName + "Group", true);
    },
    tearDown: (geneSymbol: string) => {
      d3
        .select("." + geneSymbol + "_" + plotName + "Group")
        .selectAll("*")
        .remove();
      d3
        .select("#" + geneSymbol + "_" + plotName)
        .select("svg")
        .on(".zoom", null);
    },
    cleanUp: (geneSymbol: string) => {
      d3.select("#" + geneSymbol + "_" + plotName).selectAll("*").remove();
    },
    plot(data) {
      xTickCount = data.length;
      x.domain([0, xTickCount + 1]);
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* 
        Clicking a tissueSite button 
        -- updates ui.select.tissueSite
        -- view switch to exon boxplot, if activating tissueSite only
    */
    onTissueSiteClick: evt => {
      let tissueSite = evt.target.value;
      dispatch(toggleTissueSite(tissueSite));
    }
  };
};

const TissueSiteRankingContainer = connect(mapStateToProps, mapDispatchToProps)(
  TissueSiteRanking
);

export default TissueSiteRankingContainer;
