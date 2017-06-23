import { connect } from "react-redux";

import {
  loadSearchIndex,
  addGene,
  addGenePanel,
  selectGenePanel,
  selectRefTissueSite,
  clearGeneSelection,
  clearTissueSiteSelection,
  updateIncludeGene
} from "../reducers/EntitiesActions";
import GenePanelListing from "../components/GenePanelListing";
import {
  stateInterface,
  geneEntity,
  searchIndexEntity,
  OPTION_TYPE
} from "../Interfaces";
import SearchBar from "../components/SearchBar";
import { getGenePanelEntityById } from "../store/Query";
import {
  EXON_EXPR_URL,
  GENE_EXPR_URL,
  GENE_PANEL_URL,
  GENE_PANEL_RANKING_URL,
  SEARCH_INDEX_URL
} from "../utils/Url";

const mapStateToProps = (state: stateInterface) => {
  let { entities: { gene, genePanel, searchIndex } } = state;

  /* 
    options consists of 
    -- genePanels 
    -- genes listed udner entities.searchIndex
  */
  const getOptions = (): searchIndexEntity[] => {
    let geneOptions: searchIndexEntity[] = searchIndex.map(gene => {
      return { type: OPTION_TYPE.GENE_TYPE, ...gene };
    });
    let panelOptions: searchIndexEntity[] = genePanel.map(panel => {
      return {
        type: OPTION_TYPE.PANEL_TYPE,
        name: panel.genePanelId,
        panelGenes: panel.panelGenes
      };
    });

    return panelOptions.concat(geneOptions) || [];
  };

  return {
    options: getOptions(),
    gene,
    genePanel
  };
};

const mapDispatchToProps = dispatch => {
  const onGenePanelSelect = (genePanelId: string) => {
    dispatch(selectRefTissueSite(""));
    dispatch(clearGeneSelection());
    dispatch(clearTissueSiteSelection());
    dispatch(selectGenePanel(genePanelId));
  };

  const onOptionChange = options => {
    dispatch(updateIncludeGene(options));
  };

  return {
    onGenePanelSelect,
    onOptionChange
  };
};

const SearchBarContainer = connect(mapStateToProps, mapDispatchToProps)(
  SearchBar
);

export default SearchBarContainer;
