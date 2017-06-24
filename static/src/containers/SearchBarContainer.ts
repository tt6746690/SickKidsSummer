import { connect } from "react-redux";

import {
  addGene,
  addGenePanel,
  selectGenePanel,
  selectRefTissueSite,
  clearGeneSelection,
  clearTissueSiteSelection,
  updateGene,
  updateSearchOptions,
  updateSearchOptionWithCollapse
} from "../reducers/EntitiesActions";
import {
  fetchGene,
  fetchGenePanel,
  endFetchSuccess
} from "../reducers/FetchActions";
import {
  stateInterface,
  geneEntity,
  searchIndexEntity,
  OPTION_TYPE
} from "../Interfaces";
import SearchBar from "../components/SearchBar";
import {
  getGenePanelEntityById,
  getGeneEntityById,
  getGenePanelEntityByIdList
} from "../store/Query";
import {
  EXON_EXPR_URL,
  GENE_EXPR_URL,
  GENE_PANEL_URL,
  GENE_PANEL_RANKING_URL,
  SEARCH_INDEX_URL
} from "../utils/Url";
import {
  getOptionByType,
  makeGeneOption,
  makePanelOption
} from "../utils/Option";

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, genePanel, searchIndex },
    ui: { search: { selectedOptions, collapse } }
  } = state;

  /* 
    options consists of 
    -- genePanels 
    -- genes listed under entities.searchIndex
  */
  const getOptions = (): searchIndexEntity[] => {
    let geneOptions = searchIndex.map(g => makeGeneOption(g));
    let panelOptions = genePanel.map(panel => {
      let { genePanelId: name, panelGenes } = panel;
      return makePanelOption({ name, panelGenes });
    });
    return panelOptions.concat(geneOptions) || [];
  };

  const panelFormat = (panelName: string): string =>
    panelName
      .split("_")
      .map(d => d.replace(/\b\w/g, f => f.toUpperCase()))
      .join(" ");

  console.log({ selectedOptions });

  return {
    gene,
    genePanel,
    options: getOptions(),
    selectedOptions,
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

    let promises = [];

    let geneOptions = getOptionByType(options, OPTION_TYPE.GENE_TYPE);
    let panelOptions = getOptionByType(options, OPTION_TYPE.PANEL_TYPE);
    geneOptions.forEach(option => {
      promises.push(dispatch(fetchGene(option.ensemblId)));
    });
    panelOptions.forEach(option => {
      let genePanelId = option.name;
      promises.push(dispatch(selectGenePanel(genePanelId)));
      promises.push(dispatch(fetchGenePanel(genePanelId)));
    });

    /* 
      avoid lag behavior by displaying option selected asap
    */
    dispatch(updateSearchOptions(options));

    let allGenes = geneOptions
      .map(opt => opt.ensemblId)
      .concat(flattenPanelOption(panelOptions));

    /* 
      When finished fetching data for {gene, genePanel} in options 
    */
    Promise.all(promises).then(() => {
      console.log({ geneOptions, panelOptions, allGenes });
      dispatch(updateGene(allGenes));
      dispatch(updateSearchOptionWithCollapse(options));
    });
  };

  return { onSearchBarChange };
};

const SearchBarContainer = connect(mapStateToProps, mapDispatchToProps)(
  SearchBar
);

export default SearchBarContainer;
