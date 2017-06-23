import { connect } from "react-redux";

import {
  addGene,
  addGenePanel,
  selectGenePanel,
  selectRefTissueSite,
  clearGeneSelection,
  clearTissueSiteSelection
} from "../reducers/EntitiesActions";
import { fetchGenePanel } from "../reducers/FetchActions";
import GenePanelListing from "../components/GenePanelListing";
import { stateInterface, geneEntity } from "../Interfaces";
import {
  EXON_EXPR_URL,
  GENE_EXPR_URL,
  GENE_PANEL_URL,
  GENE_PANEL_RANKING_URL
} from "../utils/Url";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, genePanel },
    ui: { select: { genePanel: selectedGenePanel } }
  } = state;

  return {
    gene,
    genePanel,
    selectedGenePanel
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /*
      Selecting a gene panel triggers 3 types of actions
      -- clears selected.gene and selected.tissueSite and selected.refTissueSite
      -- updates currently selected gene panel in ui.select.genePanel, and 
      -- fetch 
      ---- genePanel's array of genes,  
      ------ gene.{exonExpr, geneExpr} for each 
      ---- genePanel's tissueSite ranking
    */
    onGenePanelListSelect: (genePanelId: string) => {
      dispatch(selectRefTissueSite(""));
      dispatch(clearGeneSelection());
      dispatch(clearTissueSiteSelection());

      dispatch(selectGenePanel(genePanelId));
      dispatch(fetchGenePanel(genePanelId));
    }
  };
};

const GenePanelListingContainer = connect(mapStateToProps, mapDispatchToProps)(
  GenePanelListing
);

export default GenePanelListingContainer;
