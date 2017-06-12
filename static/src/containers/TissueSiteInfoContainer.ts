import { connect } from "react-redux";

import {
  toggleTissueSite,
  setPlotDisplay,
  PLOT_DISPLAY_TYPE
} from "../reducers/Actions";
import { isNonEmptyArray } from "../utils/Utils";
import { stateInterface } from "../Interfaces";
import TissueSiteInfo from "../components/TissueSiteInfo";

// transform current redux store state into component props
const mapStateToProps = (state: stateInterface) => {
  let {
    ui: { select: { tissueSite: selectedTissueSite }, plot: { color } }
  } = state;

  return {
    selectedTissueSite,
    color
  };
};

// receives dispath() function and returns callback props for injection
const mapDispatchToProps = dispatch => {
  return {
    /* 
            Clicking a tissueSite button updates ui.select.tissueSite
        */
    onTissueSiteClick: evt => {
      let tissueSite = evt.target.value;
      dispatch(toggleTissueSite(tissueSite));
      dispatch(setPlotDisplay(PLOT_DISPLAY_TYPE.EXON_EXPR_PLOT));
    }
  };
};

const TissueSiteInfoContainer = connect(mapStateToProps, mapDispatchToProps)(
  TissueSiteInfo
);

export default TissueSiteInfoContainer;
