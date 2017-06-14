import { connect } from "react-redux";

import {
  addGenePanel,
  addTissueSite,
  selectGenePanel,
  setPlotDisplay,
  PLOT_DISPLAY_TYPE
} from "../reducers/Actions";
import { isNonEmptyArray } from "../utils/Utils";
import { stateInterface } from "../Interfaces";
import Layout from "../components/Layout";

const mapStateToProps = (state: stateInterface) => {
  let { ui: { plotDisplayType } } = state;

  return {
    plotDisplayType
  };
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

            // dispatch(selectGenePanel(panelList[0]));
          }
        })
        .catch(err => console.log("fetch: ", err));
    },

    /*
            select plot to display 
            -- gene 
            -- exon 
        */
    onPlotTabSelect: tabType => {
      dispatch(setPlotDisplay(tabType));
    }
  };
};

const LayoutContainer = connect(mapStateToProps, mapDispatchToProps)(Layout);

export default LayoutContainer;
