import os
import click

from sickkidsproj import app,  db

from sickkidsproj.cache.g import RESOURCES_OPTIONS, EXTS, EXT_TEN, EXT_TWENTY, OPTION_EXONEXPR, RANKING_OPTIONS, OPTION_RANKING_GENE
from sickkidsproj.analysis.inc_data import inc_data
from sickkidsproj.analysis.ranking import computeRanking
from sickkidsproj.database.manage import load_exonreadsmapping, load_genereadsmapping
from sickkidsproj.database.resources import inspect_resources, delete_fendswith
from sickkidsproj.utils.utils import chunks
from sickkidsproj.utils.check import isEnsemblId



@app.cli.command('analysis.rank')
@click.option('--option', default=OPTION_RANKING_GENE)
@click.option('--threshold', default=EXT_TEN)
@click.option('--gene', default="")
def c_ranking(option, threshold, gene):
    if option not in RANKING_OPTIONS:
        print("Usage: flask analysis.rank --option --threshold")
        return
    if option == OPTION_RANKING_GENE and not isEnsemblId(gene):
        print("Usage: flask analysis.rank --option --threshold [gene]")
        return

    return computeRanking(option, int(threshold), gene)

@app.cli.command('analysis.inc_data')
def c_caching_exonid():
    app.logger.info("cli::inc_data")
    inc_data()

@app.cli.command('resources.delete')
@click.option('--option', default=OPTION_EXONEXPR)
@click.option('--ext', default=EXT_TWENTY)
def c_inspect_resources(option, ext):
    if option not in RESOURCES_OPTIONS:
        print("Usage: flask resources.delete --option --ext")
        return
    app.logger.info("cli::inspect_resources")
    delete_fendswith(option, ext)


@app.cli.command('resources.inspect')
@click.option('--option', default=OPTION_EXONEXPR)
def c_inspect_resources(option):
    if option not in RESOURCES_OPTIONS:
        print("Usage: flask resources.inspect [option]")
        return
    app.logger.info("cli::inspect_resources")
    print(option)
    inspect_resources(option)


@app.cli.command('db.convert')
def c_convert_ensembl_to_symbol():
    app.logger.info("cli::convert_ensembl_to_symbol")
    convert_ensembl_to_symbol()

@app.cli.command('db.create')
def c_create_db():
    app.logger.info("cli::create")
    create_db()

@app.cli.command('db.load')
def c_load_exonreadsmapping():
    app.logger.info("cli::load_exonreadsmapping")
    app.logger.info("cli::load_genereadsmapping")
    load_exonreadsmapping()

@app.cli.command('db.clear')
def c_clear_db():
    app.logger.info("cli::clear")
    clear_db()

@app.cli.command('db.stat')
def c_show_db_stat():
    app.logger.info("cli::stat")
    show_db_stat()

@app.cli.command('db.refresh')
def refresh_db():
    app.logger.info("cli::refresh")
    clear_db()
    create_db()
    load_genereadsmapping()
    load_exonreadsmapping()







