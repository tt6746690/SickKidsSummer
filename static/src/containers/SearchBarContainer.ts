import { connect } from "react-redux";

import SearchBar from "../components/SearchBar";
import { OPTION_TYPE, searchIndexEntity, stateInterface } from "../Interfaces";
import {
  selectGenePanel,
  updateSearchOptions,
  updateSearchOptionWithCollapse,
  updateSelectedGeneWithOptions
} from "../reducers/EntitiesActions";
import { fetchGene, fetchGenePanel } from "../reducers/FetchActions";
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

    /* 
      avoid lag behavior by displaying option selected asap
    */
    dispatch(updateSearchOptions(options));

    /* 
      Populate promises with fetching promise
    */
    let promises = [];

    let geneOptions = getOptionByType(options, OPTION_TYPE.GENE_TYPE);
    let panelOptions = getOptionByType(options, OPTION_TYPE.PANEL_TYPE);
    geneOptions.forEach(option => {
      promises.push(dispatch(fetchGene(option.ensemblId)));
    });
    panelOptions.forEach(option => {
      let genePanelId = option.name;
      dispatch(selectGenePanel(genePanelId));
      promises.push(dispatch(fetchGenePanel(genePanelId)));
    });

    /* 
      When finished fetching data for {gene, genePanel} in options 
      -- update search option depending on value of collapse 
      -- update ui.select.gene 
    */
    Promise.all(promises).then(() => {
      dispatch(updateSearchOptionWithCollapse(options));
      dispatch(updateSelectedGeneWithOptions(options));
    });
  };

  return { onSearchBarChange };
};

const SearchBarContainer = connect(mapStateToProps, mapDispatchToProps)(
  SearchBar
);

export default SearchBarContainer;
