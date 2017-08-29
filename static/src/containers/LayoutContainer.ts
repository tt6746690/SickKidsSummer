import { connect } from "react-redux";

import Layout from "../components/Layout";
import { stateInterface } from "../Interfaces";
import { hydrateInitialState } from "../actions/FetchActions";
import { setViewType, toggleRankedTissueSite } from "../actions/UIActions";

const mapStateToProps = (state: stateInterface) => {
  let {
    ui: {
      viewType,
      select: {
        gene: selectedGene,
        genePanel: selectedGenePanel,
        refTissueSite: selectedRefTissueSite,
        rankedTissueSite: selectedRankedTissueSite
      },
      plot: { color }
    }
  } = state;

  return {
    color,
    viewType,
    selectedGene,
    selectedGenePanel,
    selectedRefTissueSite,
    selectedRankedTissueSite
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onComponentWillMount: () => {
      dispatch(hydrateInitialState());
    },

    onTabSelect: tabType => {
      dispatch(setViewType(tabType));
    },

    onTissueSiteClick: evt => {
      let tissueSite = evt.target.value;
      dispatch(toggleRankedTissueSite(tissueSite));
    }
  };
};

const LayoutContainer = connect(mapStateToProps, mapDispatchToProps)(Layout);

export default LayoutContainer;
