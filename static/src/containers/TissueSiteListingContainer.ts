import { connect } from "react-redux";

import {
  toggleTissueSite,
  setPlotDisplay,
  PLOT_DISPLAY_TYPE
} from "../reducers/Actions";
import { stateInterface } from "../Interfaces";
import TissueSiteListing from "../components/TissueSiteListing";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { tissueSite },
    ui: { select: { tissueSite: selectedTissueSite } }
  } = state;

  return {
    tissueSite,
    selectedTissueSite
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /*
            Selecting a tissue toggles the currently selected tissueSite in the dropdown list
        */
    onTissueSiteListSelect: (tissueSite: string) => {
      dispatch(toggleTissueSite(tissueSite));
      dispatch(setPlotDisplay(PLOT_DISPLAY_TYPE.EXON_EXPR_PLOT));
    }
  };
};

const TissueSiteListingContainer = connect(mapStateToProps, mapDispatchToProps)(
  TissueSiteListing
);

export default TissueSiteListingContainer;
