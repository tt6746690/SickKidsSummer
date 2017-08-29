import { connect } from "react-redux";

import Layout from "../components/Layout";
import { stateInterface } from "../Interfaces";
import { hydrateInitialState } from "../actions/FetchActions";
import { setViewType } from "../actions/UIActions";

const mapStateToProps = (state: stateInterface) => {
  let {
    ui: {
      viewType,
      select: { gene: selectedGene, genePanel: selectedGenePanel }
    }
  } = state;

  return { selectedGene, selectedGenePanel };
};

const mapDispatchToProps = dispatch => {
  return {
    onComponentWillMount: () => {
      dispatch(hydrateInitialState());
    },

    onTabSelect: tabType => {
      dispatch(setViewType(tabType));
    }
  };
};

const LayoutContainer = connect(mapStateToProps, mapDispatchToProps)(Layout);

export default LayoutContainer;
