import { connect } from "react-redux";

import {
  selectRefTissueSite,
  setPlotDisplay,
  PLOT_DISPLAY_TYPE
} from "../reducers/Actions";
import { stateInterface } from "../Interfaces";
import TissueSiteListing from "../components/TissueSiteListing";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { tissueSite },
    ui: { select: { refTissueSite: selectedRefTissueSite } }
  } = state;

  return { tissueSite, selectedRefTissueSite };
};

const mapDispatchToProps = dispatch => {
  return {
    /*
            Selecting a tissue toggles the currently selected tissueSite in the dropdown list
        */
    onTissueSiteListSelect: (refTissueSite: string) => {
      dispatch(selectRefTissueSite(refTissueSite));
      dispatch(setPlotDisplay(PLOT_DISPLAY_TYPE.EXON_EXPR_PLOT));
    }
  };
};

const TissueSiteListingContainer = connect(mapStateToProps, mapDispatchToProps)(
  TissueSiteListing
);

export default TissueSiteListingContainer;
