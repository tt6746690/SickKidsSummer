import os
from sqlalchemy.inspection import inspect

from sickkidsproj import app, db
from sickkidsproj.database.models import ExonReadsMapping, GeneReadsMapping
from sickkidsproj.utils.check import isEnsemblId

def get_exonexpr_storepath(ensembl_id):
    """ Quries ExonReadsMapping and returns 
        corersponding storepath for ggiven ensemblId

        @param str ensemblId
        @rType str storepath: under exon_expr/
            return None if not found
        """
    mapping = ExonReadsMapping.query \
        .filter_by(ensembl_id = ensembl_id) \
        .first()

    if mapping:
        return os.path.realpath(
                os.path.join(app.config['DATA_RESOURCES_DIR'], 
                mapping.store_path + ".20"))


def get_geneexpr_storepath(ensembl_id):
    """ Quries GeneReadsMapping and returns 
        corersponding storepath for ggiven ensemblId

        @param str ensemblId
        @rType str storepath: under gene_expr/
            return None if not found
        """
    mapping = GeneReadsMapping.query \
        .filter_by(ensembl_id = ensembl_id) \
        .first()

    if mapping:
        return os.path.realpath(
                os.path.join(app.config['DATA_RESOURCES_DIR'], 
                mapping.store_path))


def get_all_exonreadsmapping_keys():
    """ Queries ExonReadsMapping and returns a list of keys

        @rType: [ ..., int ] 
    """
    query = db.session.query(GeneReadsMapping.ensembl_id.distinct())

    ensembl_ids = []
    for l in query.all():
        if len(l) == 1 and isEnsemblId(l[0]):
            ensembl_ids.append(l[0])
    return ensembl_ids





