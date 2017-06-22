import os
from sickkidsproj import app, db
from sickkidsproj.database.query import get_all_exonreadsmapping_keys
from sickkidsproj.cache.g import GENE_PANELS

def get_search_index():
    """ Returns a list of search index containing 
        
        1. ensembl_id_suffixes
            identified by the last 11 digits of ensembl_id
            with most significant digits removed during conversion to int
        2. gene_symbols
        3. gene_panels
    """

    ensembl_id_suffixes = []
    gene_symbols = []

    ensembl_ids = get_all_exonreadsmapping_keys()
    for ensembl_id in ensembl_ids:
        ensembl_id_suffixes.append(ensembl_id[-11:])


    return  ensembl_id_suffixes + GENE_PANELS

SEARCH_INDEX = get_search_index()
