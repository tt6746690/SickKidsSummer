// prefix
export const SCHEME = "https";
export const HOST = "page.ccm.sickkids.ca" || "127.0.0.1";
export const PORT = 443 || 5000;
export const URL_PREFIX = `${SCHEME}:\/\/${HOST}:${PORT}`;

// prefix strings
export const API_URL_PREFIX = `${URL_PREFIX}/api`;
export const API_SEARCH_URL_PREFIX = `${API_URL_PREFIX}/search`;
export const API_EXONEXPR_URL_PREFIX = `${API_URL_PREFIX}/exon_expr`;
export const API_GENEEXPR_URL_PREFIX = `${API_URL_PREFIX}/gene_expr`;
export const API_GENESYMBOL_URL_PREFIX = `${API_URL_PREFIX}/gene_symbol`;
export const API_PANELS_URL_PREFIX = `${API_URL_PREFIX}/gene_panels`;

/* At page loading */
export const TISSUE_SITE_LIST_URL = `${API_EXONEXPR_URL_PREFIX}/tissue_site_list`;
export const GENE_PANEL_LIST_URL = `${API_PANELS_URL_PREFIX}/gene_panel_list`;
export const SEARCH_INDEX_URL = `${API_SEARCH_URL_PREFIX}/index`;

/* On demand */
export const EXON_EXPR_URL = (ensemblId: string) =>
  `${API_EXONEXPR_URL_PREFIX}/${ensemblId}`;

export const GENE_EXPR_URL = (ensemblId: string) =>
  `${API_GENEEXPR_URL_PREFIX}/${ensemblId}`;

export const GENE_SYMBOL_URL = (ensemblId: string) =>
  `${API_GENESYMBOL_URL_PREFIX}/${ensemblId}`;

export const GENE_PANEL_URL = (genePanelId: string) =>
  `${API_PANELS_URL_PREFIX}/${genePanelId}`;

export const GENE_PANEL_RANKING_URL = (genePanelId: string) =>
  `${API_PANELS_URL_PREFIX}/ranking/${genePanelId}`;
