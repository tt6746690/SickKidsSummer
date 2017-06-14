from re import match
import os
import json

from flask import redirect, url_for, render_template, jsonify

from sickkidsproj import app, db
from sickkidsproj.models import ExonReadsMapping, GeneReadsMapping
from sickkidsproj.cors import crossdomain


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/gene_panels/gene_panel_list', methods=['GET'])
@crossdomain(origin='*')
def get_gene_panel_list():
    """ Get a list of file names as available gene panels 
        under app.config["GENE_PANEL_DIR"]"""

    with open(app.config["GENE_PANEL_LIST"], 'r') as f:
        return jsonify([panel.strip() for panel in f])


@app.route('/api/gene_panels/<gene_panel>', methods=['GET'])
@crossdomain(origin='*')
def get_gene_panel(gene_panel):
    """ Get a list of genes associated with gene_panel
    @rType dict: 
    {
        {
            "ensembl_id": "ENSG00000138435",
            "symbol": "CHRNA1"
        },
        ...  
    }
    """
    fp = os.path.join(app.config["GENE_PANEL_DIR"], gene_panel)
    with open(fp, 'r') as f:
        print(f)
        l = []
        for line in f:
            pair = line.split('\t')
            l.append({
                "symbol": pair[0].strip(),
                "ensembl_id": pair[1].strip()
                })
        return jsonify(l)

@app.route('/api/gene_panels/ranking/<gene_panel>', methods=['GET'])
@crossdomain(origin='*')
def get_gene_panel_ranking(gene_panel):
    """ Get ranking associated with gene_panel
    """
    fp = os.path.join(app.config["GENE_PANEL_RANKING_DIR"], gene_panel)
    with open(fp, 'r') as f:
        return json.dumps(json.loads(f.read()))

@app.route('/api/exon_expr/tissue_site_list', methods=['GET'])
@crossdomain(origin='*')
def get_tissue_sites():
    with open(app.config["TISSUE_SITE_LIST"], 'r') as f:
        return jsonify([site.strip() for site in f])


@app.route('/api/exon_expr/<ensembl_id>', methods=['GET'])
@crossdomain(origin='*')
def gene_exonreads(ensembl_id=None):

    if match('^ENSG[\d]{11}$', ensembl_id) is None:
        return abort(404)

    mapping = ExonReadsMapping.query \
        .filter_by(ensembl_id = ensembl_id) \
        .first()

    fp = os.path.realpath(os.path.join(app.config['DATA_RESOURCES_DIR'], mapping.store_path))
    with open(fp, 'r') as f:
        return json.dumps(json.loads(f.read()))
    
@app.route('/api/gene_expr/<ensembl_id>', methods=['GET'])
@crossdomain(origin='*')
def gene_rpkmreads(ensembl_id=None):

    if match('^ENSG[\d]{11}$', ensembl_id) is None:
        return abort(404)

    mapping = GeneReadsMapping.query \
        .filter_by(ensembl_id = ensembl_id) \
        .first()

    fp = os.path.realpath(os.path.join(app.config['DATA_RESOURCES_DIR'], mapping.store_path))
    with open(fp, 'r') as f:
        return json.dumps(json.loads(f.read()))

@app.route('/static/<path:path>')
def send_dist(path):
    """ serving files from config["STATIC_FOLDER"]
        @param path: rel path from static folder
    """
    return app.send_static_file(path)


@app.errorhandler(404)
def page_not_found(error):
    return "Resource not found page.."
