import * as React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

import { geneEntity } from "../Interfaces";
import { getGeneEntityByIdList } from "../store/Query";
import { isEmptyObject, isNonEmptyArray } from "../utils/Utils";

class GenePanelInfo extends React.Component<any, object> {
  render() {
    let {
      gene,
      genePanel,
      selectedGene,
      color,
      onPanelGeneClick,
      onPanelGeneClear
    } = this.props;

    /*
        Displays gene symbol associated with currently selected genePanel, may be 
        -- part of a entities.genePanel.paneGenes
        -- some other entities.genes
    */
    let geneEntityList = getGeneEntityByIdList(gene, selectedGene);
    let selectedGeneButtons = isNonEmptyArray(geneEntityList)
      ? geneEntityList.map((g: geneEntity, i: number) =>
          <Button
            bsStyle={!isEmptyObject(g.exonExpr) ? "default" : "warning"}
            className={"panelGeneButton"}
            value={g.ensemblId}
            key={i.toString()}
            onClick={onPanelGeneClick}
          >
            {g.geneSymbol.toUpperCase()}
          </Button>
        )
      : undefined;

    return (
      <ButtonGroup>
        {selectedGeneButtons}
      </ButtonGroup>
    );
  }
}

export default GenePanelInfo;
