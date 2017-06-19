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
import { stateInterface, geneEntity } from "../Interfaces";

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
  /* 
      Fetch {exonExpr, geneExpr} given ensemblI
    */
  const fetchExonExpr = ensemblId => {
    fetch("http://127.0.0.1:5000/api/exon_expr/" + ensemblId, {
      mode: "cors"
    })
      .then(response => response.text())
      .then(text => {
        // handles -Infinity during parsing, generated by 1samp_Ttest
        return JSON.parse(text.replace(/\-Infinity\b/g, null));
      })
      .then(data => {
        dispatch(
          addGene({
            ensemblId,
            exonExpr: data.exonExpr
          })
        );
      })
      .catch(err => console.log("fetch: ", err));
  };

  const fetchGeneExpr = ensemblId => {
    fetch("http://127.0.0.1:5000/api/gene_expr/" + ensemblId, {
      mode: "cors"
    })
      .then(response => response.json())
      .then(geneExpr => {
        dispatch(addGene({ ensemblId, geneExpr: geneExpr }));
      })
      .catch(err => console.log("fetch: ", err));
  };

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

      let fetchGenePanel = fetch(
        "http://127.0.0.1:5000/api/gene_panels/" + genePanelId,
        {
          mode: "cors"
        }
      )
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
            /* 
              Once a genePanel is selected, call fetch on 
              all genes related to the panel such that 
              -- exonExpr 
              -- geneExpr 
              are populated 
            */
            fetchExonExpr(gene.ensembl_id);
            fetchGeneExpr(gene.ensembl_id);
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
          dispatch(addGenePanel({ genePanelId, tissueRanking }));
        })
        .catch(err => console.log("fetch: ", err));
    }
  };
};

const GenePanelListingContainer = connect(mapStateToProps, mapDispatchToProps)(
  GenePanelListing
);

export default GenePanelListingContainer;
