from datetime import datetime, timedelta
from bottle import Bottle, request, response, abort

import wheater


channel_app = Bottle()

@channel_app.route('/:name/')
def status(name):

    lat = request.GET.get('lat', '60.10')
    lon = request.GET.get('lon', '9.58')

    if not lat or not lon:
        abort()

    d = {}
    if name == 'wheater':
        w = wheater.Wheater()
        d = w.fetch(lat, lon)

    return d
