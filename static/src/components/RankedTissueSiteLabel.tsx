import * as React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

import { geneEntity } from "../Interfaces";
import { getGeneEntityByIdList } from "../store/Query";
import { isEmptyObject, isNonEmptyArray } from "../utils/Utils";

class GenePanelInfo extends React.Component<any, object> {
  render() {
    let { selectedRankedTissueSite } = this.props;

    /*
        Displays gene symbol associated with currently selected genePanel, may be 
        -- part of a entities.genePanel.paneGenes
        -- some other entities.genes
    */
  }
}

export default GenePanelInfo;
