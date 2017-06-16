import { connect } from "react-redux";
import { addGene, toggleGene, clearGeneSelection } from "../reducers/Actions";
import { isNonEmptyArray } from "../utils/Utils";
import { stateInterface } from "../Interfaces";
import GenePanelInfo from "../components/GenePanelInfo";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, genePanel },
    ui: {
      select: { gene: selectedGene, genePanel: selectedGenePanel },
      plot: { color }
    }
  } = state;

  return {
    gene,
    genePanel,
    selectedGene,
    selectedGenePanel,
    color
  };
};

const mapDispatchToProps = dispatch => {
  return {
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
        .then(response => response.text())
        .then(text => {
          // handles -Infinity during parsing, generated by 1samp_Ttest
          return JSON.parse(text.replace(/\-Infinity\b/g, null));
        })
        .then(exonExpr => {
          dispatch(
            addGene({
              ensemblId,
              exonExpr: exonExpr.exonExpression
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

    onPanelGeneClear: () => {
      dispatch(clearGeneSelection());
    }
  };
};

const GenePanelInfoContainer = connect(mapStateToProps, mapDispatchToProps)(
  GenePanelInfo
);

export default GenePanelInfoContainer;
