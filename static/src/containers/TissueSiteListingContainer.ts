import { connect } from "react-redux";

import TissueSiteListing from "../components/TissueSiteListing";
import { stateInterface } from "../Interfaces";
import {
  selectRefTissueSite,
  setViewType,
  VIEW_TYPE
} from "../reducers/EntitiesActions";

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
      /* reset ui.select.tissueSite first*/
      dispatch(selectRefTissueSite(refTissueSite));
      dispatch(setViewType(VIEW_TYPE.TISSUESITE_RANKING));
    }
  };
};

const TissueSiteListingContainer = connect(mapStateToProps, mapDispatchToProps)(
  TissueSiteListing
);

export default TissueSiteListingContainer;
