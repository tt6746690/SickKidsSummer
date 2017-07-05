import { connect } from "react-redux";

import { stateInterface } from "../Interfaces";
import { selectPanelHistory } from "../actions/UIActions";
import PanelHistoryListing from "../components/PanelHistoryListing";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, genePanel },
    ui: { select: { panelHistory, genePanel: selectedGenePanel } }
  } = state;

  return { gene, genePanel, panelHistory, selectedGenePanel };
};

const mapDispatchToProps = dispatch => {
  return {
    onPanelHistorySelect: (genePanelId: string) => {
      dispatch(selectPanelHistory(genePanelId));
    }
  };
};

const PanelHistoryListingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PanelHistoryListing);

export default PanelHistoryListingContainer;
