import os
import mygene
mg = mygene.MyGeneInfo()

import click

from sickkidsproj import app,  db
from sickkidsproj.database.models import ExonReadsMapping, GeneReadsMapping
from sickkidsproj.database.query import get_all_exonreadsmapping_keys
from sickkidsproj.utils.utils import chunks

from sickkidsproj.analysis.inc_data import inc_data
from sickkidsproj.database.resources import inspect_resources, delete_fendswith

from sickkidsproj.cache.g import RESOURCES_OPTIONS, EXTS



@app.cli.command('resources.delete')
@click.option('--option', default="exon_expr")
@click.option('--ext', default="20")
def c_inspect_resources(option, ext):
    if option not in RESOURCES_OPTIONS:
        print("Usage: flask resources.inspect [option]")
        return
    if ext not in EXTS:
        print("Usage: flask resources.inspect [option]")
        return
    app.logger.info("cli::inspect_resources")
    delete_fendswith(option, ext)


@app.cli.command('resources.inspect')
@click.argument('option')
def c_inspect_resources(option):
    if option not in RESOURCES_OPTIONS:
        print("Usage: flask resources.inspect [option]")
        return
    app.logger.info("cli::inspect_resources")
    print(option)
    inspect_resources(option)


@app.cli.command('inc_data')
def c_caching_exonid():
    app.logger.info("cli::inc_data")
    inc_data()


def create_db():
    """initialize database"""
    db.create_all()

def load_exonreadsmapping():
    """ load mapping file into ExonReads table"""
    with open(app.config['EXON_READS_MAPPING'], 'r') as f:

        for line in f.read().split('\n'): 
            entry = line.split('\t')

            if len(entry) != 2:
                print("Entry not valid {}".format(entry))
                continue

            mapping = ExonReadsMapping(entry[0], entry[1])
            db.session.add(mapping) 
            print("Adding entry {}".format(entry))

            db.session.commit()

def load_genereadsmapping():
    """ load mapping file into ExonReads table"""
    with open(app.config['GENE_READS_MAPPING'], 'r') as f:

        for line in f.read().split('\n'): 
            entry = line.split('\t')

            if len(entry) != 2:
                print("Entry not valid {}".format(entry))
                continue

            mapping = GeneReadsMapping(entry[0], entry[1])
            db.session.add(mapping) 
            print("Adding entry {}".format(entry))

            db.session.commit()


def clear_db():
    """ removes all table from db"""
    meta = db.metadata
    for table in reversed(meta.sorted_tables):
        print("Clearing {}...".format(table)) 
        db.session.execute(table.delete())
    db.session.commit()

def show_db_stat():
    meta = db.metadata.sorted_tables if db.metadata else db.metadata
    print(meta)


def convert_ensembl_to_symbol():
    """Converts all ensembl_id to gene_symbol"""
    ensembl_ids = get_all_exonreadsmapping_keys()

    with open(os.path.join(app.config["DATA_RESOURCES_DIR"], "symbol.mapping"), 'w+') as f:
    
        chunk_size = 100
        for chunk in chunks(ensembl_ids, chunk_size):
            queries = mg.querymany(chunk, species="human", fields="ensembl.gene,symbol")
            for q in queries:
                ensembl_id = q["query"]
                symbol = q["symbol"] if "symbol" in q else ""

                f.write(ensembl_id + '\t' + symbol + '\n')
                f.flush()

                print(ensembl_id + '\t' + symbol)


@app.cli.command('convert')
def c_convert_ensembl_to_symbol():
    app.logger.info("cli::convert_ensembl_to_symbol")
    convert_ensembl_to_symbol()

@app.cli.command('create')
def c_create_db():
    app.logger.info("cli::create")
    create_db()

# python3 -m flask load_exonreads
@app.cli.command('load')
def c_load_exonreadsmapping():
    app.logger.info("cli::load_exonreadsmapping")
    app.logger.info("cli::load_genereadsmapping")
    load_exonreadsmapping()

@app.cli.command('clear')
def c_clear_db():
    app.logger.info("cli::clear")
    clear_db()

@app.cli.command('stat')
def c_show_db_stat():
    app.logger.info("cli::stat")
    show_db_stat()

@app.cli.command('refresh')
def refresh_db():
    app.logger.info("cli::refresh")
    clear_db()
    create_db()
    load_genereadsmapping()
    load_exonreadsmapping()


