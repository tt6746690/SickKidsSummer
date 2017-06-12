import { connect } from "react-redux";

import {
  toggleTissueSite,
  setPlotDisplay,
  PLOT_DISPLAY_TYPE
} from "../reducers/Actions";
import { isNonEmptyArray } from "../utils/Utils";
import { stateInterface } from "../Interfaces";
import TissueSiteListing from "../components/TissueSiteListing";

// transform current redux store state into component props
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

// receives dispath() function and returns callback props for injection
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
