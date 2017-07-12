from os import path
basedir = path.abspath(path.dirname(__file__))

class BaseConfig(object):
    TESTING = False
    DEBUG = False

    # dialect+driver://username:password@host:port/database
    SQLALCHEMY_DATABASE_URI = 'sqlite://:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    
    # template/static
    TEMPLATE_FOLDER = path.realpath(path.join(basedir, "static"))
    STATIC_FOLDER  = path.realpath(path.join(basedir, "static"))
    # resources
    DATA_RESOURCES_DIR = path.realpath(path.join(basedir, "resources"))
    # data
    DATA_FOLDER = path.realpath(path.join(basedir, "data"))

    # experiment data
    EXPRIMENT_DATA_DIR = path.join(DATA_FOLDER, "experiment")
    GENCODE_EXON_POS_ID_MAPPING = path.join(DATA_FOLDER, "gencode.v19.genes.patched_contigs_exons.txt")

    # mapping
    EXON_READS_MAPPING = path.join(DATA_RESOURCES_DIR, "exon_expr.mapping")
    EXON_ID_MAPPING = path.join(DATA_RESOURCES_DIR, "exon_pos_id.mapping")
    GENE_READS_MAPPING = path.join(DATA_RESOURCES_DIR, "gene_expr.mapping")
    GENE_SYMBOL_MAPPING = path.join(DATA_RESOURCES_DIR, "symbol.mapping")

    # exon_expr dir
    EXON_EXPR_DIR= path.join(DATA_RESOURCES_DIR, "exon_expr")
    TISSUE_SITE_LIST = path.join(DATA_RESOURCES_DIR, "tissue_site_list")

    # gene_expr dir 
    GENE_EXPR_DIR= path.join(DATA_RESOURCES_DIR, "gene_expr")

    # gene panels
    GENE_PANEL_DIR = path.join(DATA_RESOURCES_DIR, "gene_panels")
    GENE_PANEL_RANKING_DIR = path.join(GENE_PANEL_DIR, "ranking")
    GENE_PANEL_LIST = path.join(GENE_PANEL_DIR, "gene_panel_list")


class ProductionConfig(BaseConfig):
    """dev config"""
    TESTING = True
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'mysql://user@localhost/foo'

class DevConfig(BaseConfig):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + path.join(basedir, 'app.db')



