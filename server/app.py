from bottle import route, run, debug, Bottle, request, abort
from channel.handler import channel_app

app = Bottle()
app.mount('/channel', channel_app)

@app.route('/')
def root():
    return "Hyyyyyper"

def main():
    run(reloader=True, app=app, host='localhost', port=8888)

#@app.route('/<path:path>')
#def static(path):
#    return static_file(path, '_build/')

if __name__ == "__main__":
    main()
