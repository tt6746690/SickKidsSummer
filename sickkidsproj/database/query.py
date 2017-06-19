import os
from sickkidsproj import app, db
from sickkidsproj.database.models import ExonReadsMapping, GeneReadsMapping

def get_exonexpr_storepath(ensembl_id):
    """ Quries GeneReadsMapping and returns 
        corersponding storepath for ggiven ensemblId

        @param str ensemblId
        @rType str storepath: under exon_expr/
        """
    mapping = ExonReadsMapping.query \
        .filter_by(ensembl_id = ensembl_id) \
        .first()

    return os.path.realpath(
            os.path.join(app.config['DATA_RESOURCES_DIR'], 
            mapping.store_path + ".20"))


def get_geneexpr_storepath(ensembl_id):
    """"""
    mapping = GeneReadsMapping.query \
        .filter_by(ensembl_id = ensembl_id) \
        .first()

    return os.path.realpath(
            os.path.join(app.config['DATA_RESOURCES_DIR'], 
                mapping.store_path))

