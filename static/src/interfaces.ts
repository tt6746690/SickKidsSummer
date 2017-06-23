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

export enum OPTION_TYPE {
  GENE_TYPE,
  PANEL_TYPE
}

export interface searchIndexEntity {
  /*
    either
    -- genePanelEntity.genePanelId if option is a gene
    -- geneEntity.geneSymbol if option is a genePanel
  */
  name: string;
  type?: number; // of type enum OPTION_TYPE
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
    include: {
      gene: searchIndexEntity[];
    };
    viewType: string;
    plot: {
      color: any;
      width: number;
      height: number;
      offset: number;
    };
  };
  networks: {
    isFetching: boolean;
    fetchStatus: string;
  };
}
