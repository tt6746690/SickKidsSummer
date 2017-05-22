from sickkidsproj import app

@app.route('/')
def index():
    return 'hello !'
