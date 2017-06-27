import { connect } from "react-redux";

import ExonBoxPlotLegend from "../components/ExonBoxPlotLegend";
import { stateInterface } from "../Interfaces";
import { setRankedTissueSite } from "../actions/UIActions";

const mapStateToProps = (state: stateInterface) => {
  let {
    ui: {
      select: {
        rankedTissueSite: selectedRankedTissueSite,
        refTissueSite: selectedRefTissueSite
      },
      plot: { color }
    }
  } = state;

  return { selectedRefTissueSite, selectedRankedTissueSite, color };
};

const mapDispatchToProps = dispatch => {
  return {
    /* 
        Clicking a tissueSite button 
        -- updates ui.select.tissueSite
        -- view switch to exon boxplot, if activating tissueSite only
    */
    onTissueSiteClick: evt => {
      // let tissueSite = evt.target.value;
      // dispatch(setRankedTissueSite(tissueSite));
    }
  };
};

const ExonBoxPlotLegendContainer = connect(mapStateToProps, mapDispatchToProps)(
  ExonBoxPlotLegend
);

export default ExonBoxPlotLegendContainer;
