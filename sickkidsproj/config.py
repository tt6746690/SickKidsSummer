from os import path
basedir = path.abspath(path.dirname(__file__))

class BaseConfig(object):
    TESTING = False
    DEBUG = False

    # dialect+driver://username:password@host:port/database
    SQLALCHEMY_DATABASE_URI = 'sqlite://:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    
    # setting up directory for serving templates/static files
    TEMPLATE_FOLDER = path.realpath(path.join(basedir, "static"))
    STATIC_FOLDER = path.join(TEMPLATE_FOLDER, "dist")

    # resources
    DATA_RESOURCES_DIR = path.realpath(path.join(basedir, "resources"))
    EXON_READS_MAPPING = path.join(DATA_RESOURCES_DIR, "mapping.rel")

class ProductionConfig(BaseConfig):
    """dev config"""
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'mysql://user@localhost/foo'

class DevConfig(BaseConfig):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + path.join(basedir, 'app.db')



