from sickkidsproj import app,  db
from sickkidsproj.models import ExonReadsMapping

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

@app.cli.command('create')
def c_create_db():
    app.logger.info("cli::create")
    create_db()

# python3 -m flask load_exonreads
@app.cli.command('load')
def c_load_exonreadsmapping():
    app.logger.info("cli::load_exonreadsmapping")
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
    load_exonreadsmapping()


