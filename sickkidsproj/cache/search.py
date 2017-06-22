import os
from sickkidsproj import app, db
from sickkidsproj.database.query import get_all_exonreadsmapping_keys
from sickkidsproj.cache.g import GENE_PANELS, PANEL_REF

def get_search_index():
    """ Returns a list of search index containing 
        
        1. genes 
        -- [ ...,[ ensembl_id, gene_symbol ] ]
        2. gene_panels
        -- [ ..., [panel_name, [ ..., [ symbol, ensembl_id  ]] ]
    """

    genes = []

    with open(app.config["GENE_SYMBOL_MAPPING"], 'r') as f:
        for l in f.read().strip().split('\n'):
            ll = l.strip().split('\t')

            ensembl_id = ll[0]
            symbol = ""
            if len(ll) == 2:
                symbol = ll[1]

            genes.append([ensembl_id, symbol])

    panels = []
    for panel in GENE_PANELS:
        panel_genes = PANEL_REF[panel]
        panel_name = panel  
        panels.append([[ [g["ensembl_id"], g["symbol"]] for g in panel_genes], panel_name ])

    index = genes

    return index

SEARCH_INDEX = get_search_index()
