import { connect } from "react-redux";

import {
  addGene,
  addGenePanel,
  selectGenePanel,
  selectRefTissueSite,
  clearGeneSelection,
  clearTissueSiteSelection,
  updateIncludeGene,
  updateGene
} from "../reducers/EntitiesActions";
import { fetchGene, fetchGenePanel } from "../reducers/FetchActions";
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

  const panelFormat = (panelName: string): string =>
    panelName
      .split("_")
      .map(d => d.replace(/\b\w/g, f => f.toUpperCase()))
      .join(" ");

  return {
    options: getOptions(),
    gene,
    genePanel,
    panelFormat
  };
};

const mapDispatchToProps = dispatch => {
  const flattenPanelOption = (panelOption: searchIndexEntity[]): string[] => {
    return panelOption.reduce((acu, cur) => acu.concat(cur.panelGenes), []);
  };

  /* 
    Selecting/De-selecting an option triggers changes 
    -- update ui.include.gene with options 
    -- if option.type is GENE_TYPE
    ---- fetch gene.{exonExpr, geneExpr} if not fetched already
    -- if option.type is PANEL_TYPE
    ---- fetch gene panel and populate entities.genePanel, and once this is finished
    ---- fetch gene.{exonExpr, geneExpr} for all genes in the panel if not fetched already
  */
  const onSearchBarChange = options => {
    console.log({
      where: "onSearchBarChange",
      options
    });

    let geneOptions = options.filter(opt => opt.type === OPTION_TYPE.GENE_TYPE);
    let panelOptions = options.filter(
      opt => opt.type === OPTION_TYPE.PANEL_TYPE
    );

    geneOptions.forEach(option => {
      dispatch(fetchGene(option.ensemblId));
    });

    panelOptions.forEach(option => {
      let genePanelId = option.name;
      // dispatch(selectRefTissueSite(""));
      // dispatch(clearTissueSiteSelection());
      dispatch(selectGenePanel(genePanelId));
      dispatch(fetchGenePanel(genePanelId));
    });

    /* 
      update gene with both
      -- option.ensemblId if type is gene 
      -- option.panelGenes if type is panel 
    */
    let allGenes = geneOptions
      .map(opt => opt.ensemblId)
      .concat(flattenPanelOption(panelOptions));
    dispatch(updateGene(allGenes));
  };

  return { onSearchBarChange };
};

const SearchBarContainer = connect(mapStateToProps, mapDispatchToProps)(
  SearchBar
);

export default SearchBarContainer;
