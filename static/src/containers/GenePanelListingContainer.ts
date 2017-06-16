import { connect } from "react-redux";

import {
  addGene,
  addGenePanel,
  selectGenePanel,
  selectRefTissueSite,
  clearGeneSelection,
  clearTissueSiteSelection
} from "../reducers/Actions";
import GenePanelListing from "../components/GenePanelListing";
import { stateInterface } from "../Interfaces";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { genePanel },
    ui: { select: { genePanel: selectedGenePanel } }
  } = state;

  return {
    genePanel,
    selectedGenePanel
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /*
            Selecting a gene panel triggers 3 types of actions
            -- updates currently selected gene panel in ui.select.genePanel, and 
            -- fetch gene panel data as a side effect and when on success
            ---- clears selected.gene and selected.tissueSite and selected.refTissueSite
            ---- gene panel is added to entities.genePanel if not exist already
            ---- each gene in the gene panel is pushed to entities.gene
            ---- fetch tissueSite ranking for this particular panel
        */
    onGenePanelListSelect: (genePanelId: string) => {
      dispatch(selectGenePanel(genePanelId));
      dispatch(selectRefTissueSite(""));
      dispatch(clearGeneSelection());
      dispatch(clearTissueSiteSelection());

      fetch("http://127.0.0.1:5000/api/gene_panels/" + genePanelId, {
        mode: "cors"
      })
        .then(response => response.json())
        .then(genePanel => {
          dispatch(
            addGenePanel({
              genePanelId,
              panelGenes: genePanel.map(gene => gene.ensembl_id)
            })
          );

          genePanel.map(gene => {
            dispatch(
              addGene({
                ensemblId: gene.ensembl_id,
                geneSymbol: gene.symbol
              })
            );
          });
        })
        .catch(err => console.log("fetch: ", err));

      fetch(
        "http://127.0.0.1:5000/api/gene_panels/ranking/" +
          genePanelId +
          ".ranking",
        {
          mode: "cors"
        }
      )
        .then(response => response.json())
        .then(tissueRanking => {
          dispatch(
            addGenePanel({
              genePanelId,
              tissueRanking
            })
          );
        })
        .catch(err => console.log("fetch: ", err));
    }
  };
};

const GenePanelListingContainer = connect(mapStateToProps, mapDispatchToProps)(
  GenePanelListing
);

export default GenePanelListingContainer;
