import { connect } from "react-redux";

import {
  toggleTissueSite,
  setPlotDisplay,
  PLOT_DISPLAY_TYPE
} from "../reducers/Actions";
import { stateInterface } from "../Interfaces";
import TissueSiteInfo from "../components/TissueSiteInfo";

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
