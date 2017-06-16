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
      fetch("http://127.0.0.1:5000/api/exon_expr/tissue_site_list", {
        mode: "cors"
      })
        .then(response => response.json())
        .then(tissueList => {
          if (isNonEmptyArray(tissueList)) {
            tissueList.map(tissueSite => {
              dispatch(addTissueSite({ tissueSiteId: tissueSite }));
            });
          }
        })
        .catch(err => console.log("fetch: ", err));

      fetch("http://127.0.0.1:5000/api/gene_panels/gene_panel_list", {
        mode: "cors"
      })
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
