import os
from sickkidsproj import app

# testing purpose
ONE_EXPRDATA = os.path.join(app.config["EXPRIMENT_DATA_DIR"],"10-1-M.coverage")

# panels
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
        @rType dict: 
        [ ..., {
                "ensembl_id": "ENSG00000138435",
                "symbol": "CHRNA1"
            },
        ] 
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


""" A reference dictionary that maps ensembl_id to gene_symbol
    @rType: {
        ensembl_id: gene_symbol
    } 
"""
GENE_SYMBOL_REF = {}
with open(app.config["GENE_SYMBOL_MAPPING"], 'r') as f:
    for l in f.read().strip().split('\n'):
        ll = l.strip().split('\t')

        ensembl_id = ll[0]
        symbol = ""
        if len(ll) == 2:
            symbol = ll[1]

        GENE_SYMBOL_REF[ensembl_id] = symbol


