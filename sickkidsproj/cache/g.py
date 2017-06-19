import os
from sickkidsproj import app

GENE_PANELS = []
GENE_PANEL_PATHS = []
with open(app.config["GENE_PANEL_LIST"], "r") as f:
    for panel in f.read().strip().split('\n'):
        GENE_PANELS.append(panel)
        GENE_PANEL_PATHS.append(os.path.join(app.config["GENE_PANEL_DIR"], panel))

TISSUE_SITES = []
with open(app.config["TISSUE_SITE_LIST"], "r") as f:
    for tissueSite in f.read().strip().split('\n'):
        TISSUE_SITES.append(tissueSite)

# testing purposes
ONE_EXONEXPR = os.path.join(app.config["EXON_EXPR_DIR"], "47/ENSG00000182533")



def get_panel_gene(panel):
    """ Gets list of gene associated with a gene panel
        @param str gene_panel
        @rType [ ...,ensemblId ]
    """
    genes = []
    with open(os.path.join(app.config["GENE_PANEL_DIR"], panel), 'r') as f:
        for line in f:
            pair = line.split('\t')
            genes.append({
                "symbol": pair[0].strip(),
                "ensembl_id": pair[1].strip()
                })
    return genes

PANEL_REF = {}
for panel in GENE_PANELS:
    PANEL_REF[panel] = get_panel_gene(panel)

