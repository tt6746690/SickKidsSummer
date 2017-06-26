import { connect } from "react-redux";

import TissueSiteRanking from "../components/TissueSiteRanking";
import { stateInterface } from "../Interfaces";
import { setRankedTissueSite } from "../reducers/EntitiesActions";
import {
  getGenePanelEntityById,
  getGenePanelEntityByIdList
} from "../store/Query";
import { computePanelRanking, getTissueRanking } from "../utils/Ranking";
import { isEmptyObject } from "../utils/Utils";
import { getGeneSetHash } from "../utils/Hash";

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
