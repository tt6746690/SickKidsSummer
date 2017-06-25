import { connect } from "react-redux";

import TissueSiteRanking from "../components/TissueSiteRanking";
import { stateInterface } from "../Interfaces";
import { toggleTissueSite } from "../reducers/EntitiesActions";
import { getTissueRanking } from "../store/Query";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, tissueSite, genePanel },
    ui: {
      select: {
        genePanel: selectedGenePanel,
        refTissueSite: selectedRefTissueSite,
        tissueSite: selectedTissueSite
      },
      plot: { color, width, height, offset }
    }
  } = state;

  let selectedTissueSiteLast =
    selectedTissueSite[selectedTissueSite.length - 1];

  return {
    selectedGenePanel,
    selectedRefTissueSite,
    selectedTissueSite,
    selectedTissueSiteLast,
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
