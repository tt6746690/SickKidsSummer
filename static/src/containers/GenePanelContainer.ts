import { connect } from "react-redux";

import GenePanel from "../components/GenePanel";

import { stateInterface } from "../Interfaces";
import {
  addGene,
  addGenePanel,
  addTissueSite,
  selectGenePanel,
  toggleGene,
  toggleTissueSite,
  setPlotDisplay,
  PLOT_DISPLAY_TYPE
} from "../reducers/Actions";
import { isNonEmptyArray } from "../utils/Utils";

// transform current redux store state into component props
const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, genePanel, tissueSite },
    ui: {
      select: {
        gene: selectedGene,
        genePanel: selectedGenePanel,
        tissueSite: selectedTissueSite
      },
      plotDisplayType,
      plot: { color }
    }
  } = state;

  return {
    gene,
    genePanel,
    tissueSite,
    selectedGene,
    selectedGenePanel,
    selectedTissueSite,
    plotDisplayType,
    color
  };
};

// receives dispath() function and returns callback props for injection
const mapDispatchToProps = dispatch => {
  return {
    /*
            Initial state hydration, fetch
            -- tissueSites
            -- genePanels
        */
    onComponentWillMount: () => {
      fetch("http://127.0.0.1:5000/api/exon_expr/tissue_site_list", {
        mode: "cors"
      })
        .then(response => response.json())
        .then(tissueList => {
          if (isNonEmptyArray(tissueList)) {
            tissueList.map(tissueSite => {
              dispatch(
                addTissueSite({
                  tissueSiteId: tissueSite
                })
              );
            });
          }
        })
        .catch(err => console.log("fetch: ", err));

      fetch("http://127.0.0.1:5000/api/gene_panels/gene_panel_list", {
        mode: "cors"
      })
        .then(response => response.json())
        .then(panelList => {
          if (isNonEmptyArray(panelList)) {
            panelList.map(genePanel => {
              dispatch(
                addGenePanel({
                  genePanelId: genePanel
                })
              );
            });

            dispatch(selectGenePanel(panelList[0]));
          }
        })
        .catch(err => console.log("fetch: ", err));
    },

    /*
            Selecting a gene panel triggers 3 types of actions
            -- updates currently selected gene panel in ui.select.genePanel, and 
            -- fetch gene panel data as a side effect and when on success
            ---- gene panel is added to entities.genePanel if not exist already
            ---- each gene in the gene panel is pushed to entities.gene
        */
    onGenePanelSelect: (genePanelId: string) => {
      dispatch(selectGenePanel(genePanelId));

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
    },
    /*
            Selecting a tissue toggles the currently selected tissueSite in the dropdown list
        */
    onTissueListSelect: (tissueSite: string) => {
      dispatch(toggleTissueSite(tissueSite));
      dispatch(setPlotDisplay(PLOT_DISPLAY_TYPE.EXON_EXPR_PLOT));
    },

    /* 
            Clicking a tissueSite button updates ui.select.tissueSite
        */
    onTissueSiteClick: evt => {
      let tissueSite = evt.target.value;
      dispatch(toggleTissueSite(tissueSite));
      dispatch(setPlotDisplay(PLOT_DISPLAY_TYPE.EXON_EXPR_PLOT));
    },

    /*
            Selecting a gene triggers 2 actions
            -- sets toggles genes in ui.select.gene 
            -- fetch geneExpr / exonExpr as a side effect and when on success
            ---- populates geneEntity.{exonExpr, geneExpr} with data
        */
    onPanelGeneClick: evt => {
      let ensemblId = evt.target.value;

      dispatch(toggleGene(ensemblId));

      fetch("http://127.0.0.1:5000/api/exon_expr/" + ensemblId, {
        mode: "cors"
      })
        .then(response => response.json())
        .then(exonExpr => {
          dispatch(
            addGene({
              ensemblId,
              exonExpr: exonExpr.exon_expression
            })
          );
        })
        .catch(err => console.log("fetch: ", err));

      fetch("http://127.0.0.1:5000/api/gene_expr/" + ensemblId, {
        mode: "cors"
      })
        .then(response => response.json())
        .then(geneExpr => {
          dispatch(
            addGene({
              ensemblId,
              geneExpr: geneExpr
            })
          );
        })
        .catch(err => console.log("fetch: ", err));
    },

    /*
            select plot to display 
            -- gene 
            -- exon 
        */
    onPlotTabSelect: tabType => {
      dispatch(setPlotDisplay(tabType));
    }
  };
};

const GenePanelContainer = connect(mapStateToProps, mapDispatchToProps)(
  GenePanel
);

export default GenePanelContainer;
