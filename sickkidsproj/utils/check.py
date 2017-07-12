import os
from re import match

def isEnsemblId(ensembl_id):
    """Returns true if ensemblId is valid otherwise false"""
    return match('^ENSG[R]{0,1}[\d]{11}$', ensembl_id) 
