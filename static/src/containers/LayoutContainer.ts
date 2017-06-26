import { connect } from "react-redux";

import Layout from "../components/Layout";
import { stateInterface } from "../Interfaces";
import { setViewType } from "../reducers/EntitiesActions";
import { hydrateInitialState } from "../reducers/FetchActions";

const mapStateToProps = (state: stateInterface) => {
  let {
    ui: {
      viewType,
      select: { gene: selectedGene, genePanel: selectedGenePanel }
    }
  } = state;

  return { viewType, selectedGene, selectedGenePanel };
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
