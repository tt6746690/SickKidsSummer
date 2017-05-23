from sickkidsproj import db

# flask_sqlalchemy api http://flask-sqlalchemy.pocoo.org/2.1/api/

class ExonReadsMapping(db.Model):
    __tablename__ = 'ExonReadsMapping'

    exonreads_id = db.Column(db.Integer, primary_key=True)
    ensembl_id = db.Column(db.String(20), unique=True)
    store_path = db.Column(db.String(120), unique=True)
    
    def __init__(self, ensembl_id=None, store_path=None):
        self.ensembl_id = ensembl_id
        self.store_path = store_path

    def __repr__(self):
        return '<ExonReads %r>' % self.ensembl_id
