import os
from sickkidsproj import app

GENE_PANELS = []
with open(app.config["GENE_PANEL_LIST"], "r") as f:
    for panel in f.read().strip().split('\n'):
        GENE_PANELS.append(os.path.join(app.config["GENE_PANEL_DIR"], panel))

TISSUE_SITES = []
with open(app.config["TISSUE_SITE_LIST"], "r") as f:
    for tissueSite in f.read().strip().split('\n'):
        TISSUE_SITES.append(tissueSite)

# testing purposes
ONE_EXONEXPR = os.path.join(app.config["EXON_EXPR_DIR"], "47/ENSG00000182533")




