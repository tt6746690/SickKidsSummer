import * as React from "react";
import { ButtonGroup, Button } from "react-bootstrap";

import { isEmptyObject, isNonEmptyArray } from "../utils/Utils";
import { getGenePanelEntityById, getGeneEntityByIdList } from "../store/Query";
import { geneEntity } from "../Interfaces";

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
