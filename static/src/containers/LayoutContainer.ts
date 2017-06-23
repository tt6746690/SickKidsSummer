import { connect } from "react-redux";

import { setViewType, VIEW_TYPE } from "../reducers/EntitiesActions";
import { hydrateInitialState } from "../reducers/FetchActions";
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
      dispatch(hydrateInitialState());
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
