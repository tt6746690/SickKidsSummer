import { connect } from "react-redux";

import {
  addGene,
  addGenePanel,
  selectGenePanel,
  selectRefTissueSite,
  clearGeneSelection,
  clearTissueSiteSelection,
  updateGene,
  updateSearchOptions
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
import { getGenePanelEntityById, getGeneEntityById } from "../store/Query";
import {
  EXON_EXPR_URL,
  GENE_EXPR_URL,
  GENE_PANEL_URL,
  GENE_PANEL_RANKING_URL,
  SEARCH_INDEX_URL
} from "../utils/Url";

const getOptionByType = (
  options: searchIndexEntity[],
  optionType: OPTION_TYPE.GENE_TYPE | OPTION_TYPE.PANEL_TYPE
): searchIndexEntity[] => {
  return options.filter(opt => opt.type === optionType);
};

const makeGeneOption = (index: searchIndexEntity): searchIndexEntity => {
  return { ...index, type: OPTION_TYPE.GENE_TYPE };
};

const makePanelOption = (index: searchIndexEntity): searchIndexEntity => {
  return { ...index, type: OPTION_TYPE.PANEL_TYPE };
};

const mapStateToProps = (state: stateInterface) => {
  let {
    entities: { gene, genePanel, searchIndex },
    ui: { search: { selectedOptions, collapse } }
  } = state;

  /* 
    options consists of 
    -- genePanels 
    -- genes listed udner entities.searchIndex
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

  const getSelectedOptions = (): searchIndexEntity[] => {
    let selectedOpt: searchIndexEntity[] = [];
    let geneOptions = getOptionByType(selectedOptions, OPTION_TYPE.GENE_TYPE);
    let panelOptions = getOptionByType(selectedOptions, OPTION_TYPE.PANEL_TYPE);

    geneOptions.forEach(geneOption => selectedOpt.push(geneOption));
    /* 
      convert panelOptions to several geneOptions if collapse is false
    */
    if (collapse) {
      panelOptions.forEach(panelOption => selectedOpt.push(panelOption));
    } else {
      panelOptions.forEach(panelOption => {
        panelOption.panelGenes.forEach(ensemblId => {
          let geneEntity = getGeneEntityById(gene, ensemblId);
          let name = geneEntity && geneEntity.geneSymbol;
          selectedOpt.push(makeGeneOption({ name, ensemblId }));
        });
      });
    }
    return selectedOpt;
  };

  return {
    gene,
    genePanel,
    options: getOptions(),
    selectedOptionsOnDisplay: getSelectedOptions(),
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

    let geneOptions = getOptionByType(options, OPTION_TYPE.GENE_TYPE);
    let panelOptions = getOptionByType(options, OPTION_TYPE.PANEL_TYPE);

    geneOptions.forEach(option => {
      dispatch(fetchGene(option.ensemblId));
    });

    panelOptions.forEach(option => {
      let genePanelId = option.name;
      // dispatch(selectRefTissueSite(""));
      // dispatch(clearTissueSiteSelection());
      dispatch(selectGenePanel(genePanelId));
      dispatch(fetchGenePanel(genePanelId)).then(() =>
        dispatch(endFetchSuccess())
      );
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

    /* 
      Re-set search.selectedOption based on ui.select.gene if collapse is false
    */
    // if (collapse) {
    //   dispatch(updateSearchOptions(options));
    // } else {
    //   let expandedOptions = allGenes.map(ensemblId => {
    //     let geneEntity = getGeneEntityById(gene, ensemblId);
    //     let name = geneEntity && geneEntity.geneSymbol;
    //   })
    // }
  };

  return { onSearchBarChange };
};

const SearchBarContainer = connect(mapStateToProps, mapDispatchToProps)(
  SearchBar
);

export default SearchBarContainer;
