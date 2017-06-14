// state interface
export interface geneEntity {
  ensemblId: string;
  geneSymbol?: string;
  geneExpr?: Object;
  exonExpr?: Object;
}

export interface genePanelEntity {
  genePanelId: string;
  panelGenes?: string[];
  tissueRanking?: Object;
}

export interface tissueSiteEntity {
  tissueSiteId: string;
}

export interface stateInterface {
  entities: {
    genePanel: genePanelEntity[];
    gene: geneEntity[];
    tissueSite: tissueSiteEntity[];
  };
  ui: {
    select: {
      genePanel: string;
      refTissueSite: string;
      gene: string[];
      tissueSite: string[];
    };
    viewType: string;
    plot: {
      color: any;
      width: number;
      height: number;
      offset: number;
    };
  };
}
