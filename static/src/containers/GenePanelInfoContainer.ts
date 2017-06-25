import { connect } from "react-redux";

import GenePanelInfo from "../components/GenePanelInfo";
import { stateInterface } from "../Interfaces";
import { toggleGene } from "../reducers/EntitiesActions";

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
        Selecting a gene
        -- sets toggles genes in ui.select.gene 
    */
    onPanelGeneClick: evt => {
      let ensemblId = evt.target.value;
      dispatch(toggleGene(ensemblId));
    }
  };
};

const GenePanelInfoContainer = connect(mapStateToProps, mapDispatchToProps)(
  GenePanelInfo
);

export default GenePanelInfoContainer;
