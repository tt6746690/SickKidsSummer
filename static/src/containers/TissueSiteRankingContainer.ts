import { connect } from "react-redux";

import { toggleTissueSite, setViewType, VIEW_TYPE } from "../reducers/Actions";
import { stateInterface } from "../Interfaces";
import TissueSiteRanking from "../components/TissueSiteRanking";
import { getTissueRanking } from "../store/Query";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { tissueSite, genePanel },
    ui: {
      select: {
        genePanel: selectedGenePanel,
        refTissueSite: selectedRefTissueSite,
        tissueSite: selectedTissueSite
      },
      plot: { color }
    }
  } = state;

  return {
    selectedGenePanel,
    selectedRefTissueSite,
    selectedTissueSite,
    color,
    getRanking() {
      return getTissueRanking(
        genePanel,
        selectedGenePanel,
        selectedRefTissueSite
      );
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* 
        Clicking a tissueSite button 
        -- updates ui.select.tissueSite
        -- view switch to exon boxplot, if activating tissueSite only
    */
    onTissueSiteClick: evt => {
      let tissueSite = evt.target.value;
      dispatch(toggleTissueSite(tissueSite));
    }
  };
};

const TissueSiteRankingContainer = connect(mapStateToProps, mapDispatchToProps)(
  TissueSiteRanking
);

export default TissueSiteRankingContainer;
