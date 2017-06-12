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
      gene: string[];
      tissueSite: string[];
    };
    plotDisplayType: string;
    plot: {
      color: any;
      width: number;
      height: number;
      offset: number;
    };
  };
}
