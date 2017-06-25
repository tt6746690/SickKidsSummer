import * as React from "react";
import { Typeahead } from "react-bootstrap-typeahead";

import { OPTION_TYPE } from "../Interfaces";
import { getGeneEntityByIdList } from "../store/Query";

class SearchBar extends React.Component<any, object> {
  _renderMenuItemChildren = option => {
    let { gene, panelFormat } = this.props;

    console.log("render Menuitemchildren with option: ", option);

    switch (option.type) {
      case OPTION_TYPE.GENE_TYPE:
        return [
          <div key={"name"} style={{ fontSize: "17px" }}>
            {option.name}
          </div>,
          <div key={"ensemblId"} style={{ fontSize: "10px" }}>
            {option.ensemblId}
          </div>
        ];
      case OPTION_TYPE.PANEL_TYPE:
        return [
          <div key={"name"} style={{ fontSize: "20px" }}>
            {panelFormat(option.name)}
          </div>,
          <div key={"panelGenes"}>
            {getGeneEntityByIdList(gene, option.panelGenes)
              .map(g => g.geneSymbol)
              .join(", ")}
          </div>
        ];
    }
  };

  render() {
    let { options, selectedOptions, onSearchBarChange } = this.props;

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
        selected={selectedOptions}
        onChange={onSearchBarChange}
        renderMenuItemChildren={this._renderMenuItemChildren}
        placeholder="Pick a gene or gene panel..."
      />
    );
  }
}

export default SearchBar;
