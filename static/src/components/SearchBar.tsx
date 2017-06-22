import * as React from "react";
import {
  Typeahead,
  AsyncTypeahead,
  Token,
  tokenContainer
} from "react-bootstrap-typeahead";

import { getGeneEntityByIdList } from "../store/Query";

class SearchBar extends React.Component<any, object> {
  componentWillMount() {
    let { fetchSearchIndex } = this.props;
    console.log("componentWIllMount");
    fetchSearchIndex();
  }

  render() {
    let { options, onSearchBarChange, gene } = this.props;

    const _renderMenuItemChildren = option => {
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
        onChange={onSearchBarChange}
        renderMenuItemChildren={_renderMenuItemChildren}
        placeholder="Pick a gene or gene panel..."
      />
    );
  }
}

export default SearchBar;
