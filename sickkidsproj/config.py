import os 
basedir = os.path.abspath(os.path.dirname(__file__))

class BaseConfig(object):
    TESTING = False
    DEBUG = False
    # dialect+driver://username:password@host:port/database
    SQLALCHEMY_DATABASE_URI = 'sqlite://:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class ProductionConfig(BaseConfig):
    """dev config"""
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'mysql://user@localhost/foo'

class DevConfig(BaseConfig):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

    DATA_RESOURCES_DIR = os.path.join(basedir, "resources")
    EXON_READS_MAPPING = os.path.join(DATA_RESOURCES_DIR, "mapping.rel")


