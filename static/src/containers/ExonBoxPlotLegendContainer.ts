import { connect } from "react-redux";
import { toggleTissueSite } from "../reducers/EntitiesActions";
import { stateInterface } from "../Interfaces";
import ExonBoxPlotLegend from "../components/ExonBoxPlotLegend";
import { getTissueRanking } from "../store/Query";

const mapStateToProps = (state: stateInterface) => {
  let {
    ui: { select: { tissueSite: selectedTissueSite }, plot: { color } }
  } = state;

  return {
    selectedTissueSite,
    color
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

const ExonBoxPlotLegendContainer = connect(mapStateToProps, mapDispatchToProps)(
  ExonBoxPlotLegend
);

export default ExonBoxPlotLegendContainer;
