import * as React from "react";
import {
  Typeahead,
  AsyncTypeahead,
  Token,
  tokenContainer
} from "react-bootstrap-typeahead";

import { getGeneEntityByIdList } from "../store/Query";
import { OPTION_TYPE } from "../Interfaces";
import { genePropertyPopulated, getGenePanelEntityById } from "../store/Query";

class SearchBar extends React.Component<any, object> {
  componentWillMount() {
    let { fetchSearchIndex } = this.props;
    fetchSearchIndex();
  }

  _renderMenuItemChildren = option => {
    let { gene } = this.props;
    return [
      <div key={"name"} style={{ fontSize: "20px" }}>
        {option.name}
      </div>,
      option.hasOwnProperty("ensemblId") &&
        <div key={"ensemblId"}>
          {option.ensemblId}
        </div>,
      option.hasOwnProperty("panelGenes") &&
        /* 
            not working for now, because panel not selected entities.gene is empty
          */
        <div key={"panelGenes"}>
          {getGeneEntityByIdList(gene, option.panelGenes)
            .map(g => g.geneSymbol)
            .join("...")}
        </div>
    ];
  };

  _loadGene = ensemblId => {
    let { gene, fetchExonExpr, fetchGeneExpr } = this.props;

    console.log({ where: "_loadGene", ensemblId });
    !genePropertyPopulated(gene, ensemblId, "exonExpr") &&
      fetchExonExpr(ensemblId);
    !genePropertyPopulated(gene, ensemblId, "geneExpr") &&
      fetchGeneExpr(ensemblId);
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
  _onSearchBarChange = options => {
    let {
      genePanel,
      fetchGenePanel,
      onGenePanelSelect,
      onOptionChange
    } = this.props;

    console.log({ where: "onSearchBarChange", options });

    onOptionChange(options);

    options.forEach(option => {
      switch (option.type) {
        case OPTION_TYPE.GENE_TYPE:
          this._loadGene(option.ensemblId);
          break;
        case OPTION_TYPE.PANEL_TYPE:
          let genePanelId = option.name;
          onGenePanelSelect(genePanelId);
          Promise.all([fetchGenePanel(genePanelId)]);

          let panel = getGenePanelEntityById(genePanel, genePanelId);
          panel.panelGenes.map(ensemblId => {
            this._loadGene(ensemblId);
          });
      }
    });
  };

  render() {
    let { options } = this.props;

    return (
      <Typeahead
        bsSize={"large"}
        options={options}
        labelKey={"name"}
        filterBy={["name"]}
        multiple
        clearButton
        emptyLabel
        justify
        maxResults={5}
        maxHeight={330}
        paginate={true}
        onChange={this._onSearchBarChange}
        renderMenuItemChildren={this._renderMenuItemChildren}
        placeholder="Pick a gene or gene panel..."
      />
    );
  }
}

export default SearchBar;
