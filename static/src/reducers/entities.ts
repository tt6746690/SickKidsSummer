import {
  ADD_GENE,
  ADD_GENE_PANEL,
  ADD_TISSUE_SITE,
  LOAD_SEARCH_INDEX
} from "./EntitiesActions";

import {
  geneEntity,
  genePanelEntity,
  tissueSiteEntity,
  stateInterface
} from "../interfaces";
import { isEmptyObject } from "../utils/Utils";

const pushGene = (state: geneEntity[] = [], action) => {
  if (state.findIndex(e => e.ensemblId === action.ensemblId) == -1) {
    return [
      ...state,
      {
        ensemblId: action.ensemblId,
        geneSymbol: action.geneSymbol,
        geneExpr: action.geneExpr,
        exonExpr: action.exonExpr,
        tissueRanking: action.tissueRanking
      }
    ];
  } else {
    return state.map(gene => {
      if (gene.ensemblId === action.ensemblId) {
        return {
          ...gene,
          ensemblId: action.ensemblId,
          geneSymbol: gene.geneSymbol === ""
            ? action.geneSymbol
            : gene.geneSymbol,
          geneExpr: isEmptyObject(gene.geneExpr)
            ? action.geneExpr
            : gene.geneExpr,
          exonExpr: isEmptyObject(gene.exonExpr)
            ? action.exonExpr
            : gene.exonExpr,
          tissueRanking: isEmptyObject(gene.tissueRanking)
            ? action.tissueRanking
            : gene.tissueRanking
        };
      } else {
        return { ...gene };
      }
    });
  }
};

// -- If genePanelId already exists in entities.genePanel,
// ---- find the matching genePanelId to that specified by action.genePanelId
// ---- then update other members
// -- otherwise, return the previous state
const pushGenePanel = (state: genePanelEntity[] = [], action) => {
  if (state.findIndex(e => e.genePanelId == action.genePanelId) == -1) {
    return [
      ...state,
      {
        genePanelId: action.genePanelId,
        panelGenes: [...action.panelGenes],
        tissueRanking: { ...action.tissueRanking }
      }
    ];
  } else {
    return state.map(genePanel => {
      if (genePanel.genePanelId == action.genePanelId) {
        return {
          genePanelId: action.genePanelId,
          panelGenes: genePanel.panelGenes.length === 0
            ? [...action.panelGenes]
            : [...genePanel.panelGenes],
          tissueRanking: isEmptyObject(genePanel.tissueRanking)
            ? { ...action.tissueRanking }
            : { ...genePanel.tissueRanking }
        };
      } else {
        return { ...genePanel };
      }
    });
  }
};

const pushTissueSite = (state: tissueSiteEntity[] = [], action) => {
  return [...state, ...action.tissueSiteList];
};

export default function entities(state, action) {
  switch (action.type) {
    case ADD_GENE:
      return {
        ...state,
        gene: pushGene(state.gene, action)
      };
    case ADD_GENE_PANEL:
      return {
        ...state,
        genePanel: pushGenePanel(state.genePanel, action)
      };
    case ADD_TISSUE_SITE:
      return {
        ...state,
        tissueSite: pushTissueSite(state.tissueSite, action)
      };
    case LOAD_SEARCH_INDEX:
      return {
        ...state,
        searchIndex: action.searchIndex
      };
    default:
      return state;
  }
}
