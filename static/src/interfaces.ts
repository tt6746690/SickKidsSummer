// state interface
export interface geneEntity {
  ensemblId: string;
  geneSymbol?: string;
  geneExpr?: Object;
  exonExpr?: Object;
  tissueRanking?: Object;
}

export interface genePanelEntity {
  genePanelId: string;
  panelGenes?: string[];
  tissueRanking?: Object;
}

export interface tissueSiteEntity {
  tissueSiteId: string;
}

export interface searchIndexEntity {
  /*
    either
    -- genePanelEntity.genePanelId if option is a gene
    -- geneEntity.geneSymbol if option is a genePanel
  */
  name: string;
  ensemblId?: string; // if option is a gene
  panelGenes?: string[]; // if option is a genePanel
}

export interface stateInterface {
  entities: {
    genePanel: genePanelEntity[];
    gene: geneEntity[];
    tissueSite: tissueSiteEntity[];
    searchIndex: searchIndexEntity[];
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
