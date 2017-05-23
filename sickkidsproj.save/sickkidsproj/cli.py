from sickkidsproj import app

# python3 -m flask load_exonreads
@app.cli.command('load_exonreads')
def load_exonreads():
    """ load mapping file into ExonReads"""
