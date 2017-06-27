import { connect } from "react-redux";

import { setRankedTissueSite } from "../actions/UIActions";
import TissueSiteRanking from "../components/TissueSiteRanking";
import { stateInterface } from "../Interfaces";
import { getTissueRanking } from "../utils/Ranking";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, tissueSite, genePanel },
    ui: {
      select: {
        gene: selectedGene,
        genePanel: selectedGenePanel,
        refTissueSite: selectedRefTissueSite,
        rankedTissueSite: selectedRankedTissueSite
      },
      plot: { color, width, height, offset }
    }
  } = state;

  return {
    selectedGenePanel,
    selectedRefTissueSite,
    selectedRankedTissueSite,
    color,
    /* 
      Gets ranking for ui.select.gene 
      -- compute panel ranking is tissueRanking has not been computed beforehand 
      */
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
      dispatch(setRankedTissueSite(tissueSite));
    }
  };
};

const TissueSiteRankingContainer = connect(mapStateToProps, mapDispatchToProps)(
  TissueSiteRanking
);

export default TissueSiteRankingContainer;
