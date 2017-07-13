import mygene
mg = mygene.MyGeneInfo()

from sickkidsproj import app,  db
from sickkidsproj.database.models import ExonReadsMapping, GeneReadsMapping
from sickkidsproj.database.query import get_all_exonreadsmapping_keys


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


def create_db():
    """initialize database"""
    db.create_all()


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
