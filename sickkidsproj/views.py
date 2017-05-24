from re import match
from os import path

from flask import redirect, url_for, render_template

from sickkidsproj import app, db
from sickkidsproj.models import ExonReadsMapping


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/exon_expr/<ensembl_id>', methods=['GET'])
def gene_exonreads(ensembl_id=None):

    if match('^ENSG[\d]{11}$', ensembl_id) is None:
        return abort(404)

    mapping = ExonReadsMapping.query \
        .filter_by(ensembl_id = ensembl_id) \
        .first()

    fp = path.realpath(path.join(app.config['DATA_RESOURCES_DIR'], mapping.store_path))
    with open(fp, 'r') as f:
        return f.read()


@app.errorhandler(404)
def page_not_found(error):
    return "Resource not found page.."
