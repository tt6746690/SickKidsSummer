import { connect } from "react-redux";

import TissueSiteListing from "../components/TissueSiteListing";
import { stateInterface } from "../Interfaces";
import { setRefTissueSite, setRankedTissueSite } from "../actions/UIActions";

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
    */
    onTissueSiteListSelect: (tissueSiteId: string) => {
      dispatch(setRefTissueSite(tissueSiteId));
    }
  };
};

const TissueSiteListingContainer = connect(mapStateToProps, mapDispatchToProps)(
  TissueSiteListing
);

export default TissueSiteListingContainer;
