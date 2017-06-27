import { connect } from "react-redux";

import Layout from "../components/Layout";
import { stateInterface } from "../Interfaces";
import { hydrateInitialState } from "../actions/FetchActions";

const mapStateToProps = (state: stateInterface) => {
  let {
    ui: { select: { gene: selectedGene, genePanel: selectedGenePanel } }
  } = state;

  return { selectedGene, selectedGenePanel };
};

const mapDispatchToProps = dispatch => {
  return {
    onComponentWillMount: () => {
      dispatch(hydrateInitialState());
    }
  };
};

const LayoutContainer = connect(mapStateToProps, mapDispatchToProps)(Layout);

export default LayoutContainer;
