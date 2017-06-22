import os
from re import match

def isEnsemblId(ensembl_id):
    """Returns true if ensemblId is valid otherwise false"""
    return match('^ENSG[\d]{11}$', ensembl_id) 
