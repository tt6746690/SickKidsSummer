from re import match
import os
import json

from flask import redirect, url_for, render_template, jsonify, request

from sickkidsproj import app, db
from sickkidsproj.database.models import ExonReadsMapping, GeneReadsMapping
from sickkidsproj.database.query import get_exonexpr_storepath, get_geneexpr_storepath
from sickkidsproj.analysis.ranking import computeGeneLevelRanking, computePanelLevelRanking
from sickkidsproj.cache.g import GENE_PANELS, ONE_EXONEXPR, TISSUE_SITES, PANEL_REF, GENE_SYMBOL_REF
from sickkidsproj.cache.search import SEARCH_INDEX
from sickkidsproj.utils.cors import crossdomain
from sickkidsproj.utils.check import isEnsemblId


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/gene_panels/gene_panel_list', methods=['GET'])
@crossdomain(origin='*')
def get_gene_panel_list():
    """ Get a list of file names as available gene panels 
        under app.config["GENE_PANEL_DIR"]"""
    return jsonify(GENE_PANELS)


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
    return jsonify(PANEL_REF[gene_panel])


@app.route('/api/gene_panels/ranking/<gene_panel>', methods=['GET'])
@crossdomain(origin='*')
def get_gene_panel_ranking(gene_panel):
    """ Get ranking associated with gene_panel
    """

    threshold = request.args["threshold"] if "threshold" in request.args else "10"

    fp = os.path.join(
        app.config["GENE_PANEL_RANKING_DIR"], gene_panel + '.ranking.' + threshold)
    with open(fp, 'r') as f:
        return json.dumps(json.loads(f.read()))


@app.route('/api/exon_expr/tissue_site_list', methods=['GET'])
@crossdomain(origin='*')
def get_tissue_sites():
    return jsonify(TISSUE_SITES)


@app.route('/api/exon_expr/<ensembl_id>', methods=['GET'])
@crossdomain(origin='*')
def gene_exonreads(ensembl_id=None):

    if not isEnsemblId(ensembl_id):
        return abort(404)
    
    threshold = request.args["threshold"] if "threshold" in request.args else "10"
    fp = get_exonexpr_storepath(ensembl_id) + "." + threshold

    with open(fp, 'r') as f:
        return json.dumps(json.loads(f.read()))


@app.route('/api/gene_expr/<ensembl_id>', methods=['GET'])
@crossdomain(origin='*')
def gene_rpkmreads(ensembl_id=None):

    if not isEnsemblId(ensembl_id):
        return abort(404)

    fp = get_geneexpr_storepath(ensembl_id)
    with open(fp, 'r') as f:
        return json.dumps(json.loads(f.read()))


@app.route('/api/gene_symbol/<ensembl_id>', methods=['GET'])
@crossdomain(origin='*')
def get_gene_symbol(ensembl_id=None):

    res = {}
    res["geneSymbol"] = ""

    if ensembl_id in GENE_SYMBOL_REF:
        res["geneSymbol"] = GENE_SYMBOL_REF[ensembl_id]

    return jsonify(res)


@app.route('/api/search/index', methods=['GET'])
@crossdomain(origin='*')
def send_search_index(ensembl_id=None):
    return jsonify(SEARCH_INDEX)


@app.route('/admin/ranking/gene/all', methods=['GET'])
@crossdomain(origin='*')
def compute_ranking_all_gene():

    threshold = request.args["threshold"]
    return computeGeneLevelRanking(threshold)



@app.route('/admin/ranking/panel/all', methods=['GET'])
@crossdomain(origin='*')
def compute_ranking_all_panel():
    threshold = request.args["threshold"]
    return str(computePanelLevelRanking(threshold))


@app.errorhandler(404)
def page_not_found(error):
    return "Resource not found page.."


@app.route('/<path:path>')
def send_dist(path):
    """ serving files from config["STATIC_FOLDER"]
        @param path: rel path from static folder
    """
    return app.send_static_file(path)
