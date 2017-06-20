import { connect } from "react-redux";

import {
  selectRefTissueSite,
  toggleTissueSite,
  setViewType,
  VIEW_TYPE
} from "../reducers/Actions";
import { stateInterface } from "../Interfaces";
import TissueSiteListing from "../components/TissueSiteListing";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, tissueSite },
    ui: { select: { refTissueSite: selectedRefTissueSite } }
  } = state;

  return { gene, tissueSite, selectedRefTissueSite };
};

const mapDispatchToProps = dispatch => {
  return {
    /*
        Selecting a tissueSite in dropdown
        -- makes selected tisseSite the reference tissueSite
        -- switch view to the ranking table
    */
    onTissueSiteListSelect: (refTissueSite: string) => {
      dispatch(selectRefTissueSite(refTissueSite));
      dispatch(setViewType(VIEW_TYPE.TISSUESITE_RANKING));
    }
  };
};

const TissueSiteListingContainer = connect(mapStateToProps, mapDispatchToProps)(
  TissueSiteListing
);

export default TissueSiteListingContainer;
