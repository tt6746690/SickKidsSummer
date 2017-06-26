import { geneEntity, genePanelEntity, tissueSiteEntity } from "../interfaces";
import { isEmptyObject } from "../utils/Utils";
import {
  ADD_GENE,
  ADD_GENE_PANEL,
  ADD_TISSUE_SITE,
  LOAD_SEARCH_INDEX
} from "./EntitiesActions";

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
          geneSymbol: action.geneSymbol === ""
            ? gene.geneSymbol
            : action.geneSymbol,
          geneExpr: isEmptyObject(action.geneExpr)
            ? gene.geneExpr
            : action.geneExpr,
          exonExpr: isEmptyObject(action.exonExpr)
            ? gene.exonExpr
            : action.exonExpr,
          tissueRanking: isEmptyObject(action.tissueRanking)
            ? gene.tissueRanking
            : action.tissueRanking
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
          panelGenes: action.panelGenes.length === 0
            ? [...genePanel.panelGenes]
            : [...action.panelGenes],
          tissueRanking: isEmptyObject(action.tissueRanking)
            ? { ...genePanel.tissueRanking }
            : { ...action.tissueRanking }
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
