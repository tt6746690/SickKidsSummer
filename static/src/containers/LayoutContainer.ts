import { connect } from "react-redux";

import {
  addGenePanel,
  addTissueSite,
  selectGenePanel,
  setViewType,
  VIEW_TYPE
} from "../reducers/Actions";
import { isNonEmptyArray } from "../utils/Utils";
import { stateInterface } from "../Interfaces";
import Layout from "../components/Layout";
import { TISSUE_SITE_LIST_URL, GENE_PANEL_LIST_URL } from "../utils/Url";

const mapStateToProps = (state: stateInterface) => {
  let { ui: { viewType, select: { genePanel: selectedGenePanel } } } = state;

  return { viewType, selectedGenePanel };
};

const mapDispatchToProps = dispatch => {
  return {
    /*
            Initial state hydration, fetch
            -- tissueSites
            -- genePanels
        */
    onComponentWillMount: () => {
      fetch(TISSUE_SITE_LIST_URL, { mode: "cors" })
        .then(response => response.json())
        .then(tissueList => {
          if (isNonEmptyArray(tissueList)) {
            tissueList.map(tissueSite => {
              dispatch(addTissueSite({ tissueSiteId: tissueSite }));
            });
          }
        })
        .catch(err => console.log("fetch: ", err));

      fetch(GENE_PANEL_LIST_URL, { mode: "cors" })
        .then(response => response.json())
        .then(panelList => {
          if (isNonEmptyArray(panelList)) {
            panelList.map(genePanel => {
              dispatch(addGenePanel({ genePanelId: genePanel }));
            });
          }
        })
        .catch(err => console.log("fetch: ", err));
    },
    /*
        select plot to display 
        -- tissue ranking table
        -- gene boxplot
        -- exon boxplot
    */
    onTabSelect: tabType => {
      dispatch(setViewType(tabType));
    }
  };
};

const LayoutContainer = connect(mapStateToProps, mapDispatchToProps)(Layout);

export default LayoutContainer;
