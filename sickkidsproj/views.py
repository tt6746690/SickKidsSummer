from re import match
from os import path

from flask import redirect, url_for

from sickkidsproj import app, db
from sickkidsproj.models import ExonReadsMapping


@app.route('/')
def index():
    mapping = ExonReadsMapping.query.all()
    return '\n'.join([m.ensembl_id for m in mapping])


@app.route('/api/gene/<ensembl_id>')
def gene_exonreads(ensembl_id):

    if match('^ENSG[\d]{11}$', ensembl_id) is None:
        return redirect(url_for('not_found'))

    mapping = ExonReadsMapping.query \
        .filter_by(ensembl_id = ensembl_id) \
        .first()

    fp = path.realpath(path.join(app.config['DATA_RESOURCES_DIR'], mapping.store_path))
    with open(fp, 'r') as f:
        return f.read()


@app.route('/not_found')
def nout_found():
    return "Resource not found page.."
