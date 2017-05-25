from flask import Flask 
from flask_sqlalchemy import SQLAlchemy

from sickkidsproj.config import BaseConfig, DevConfig

# Note
# -- flask app object creation must be in __init__.py
# -- view functions has to be imported in __init__.py after application object is created

app = Flask(__name__, 
            static_folder=BaseConfig.STATIC_FOLDER, 
            template_folder=BaseConfig.TEMPLATE_FOLDER,
            static_url_path='/static/')

app.config.from_object(DevConfig)

# db holds funtions from sqlalchemy and sqlalchemy.orm and db.models for model declaration
db = SQLAlchemy(app) 


# importing but notusing views, prevents circular imports
from sickkidsproj import views, models, cli, cors



