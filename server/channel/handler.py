from datetime import datetime, timedelta
from bottle import Bottle, request, response

import requests
import lxml



channel_app = Bottle()

@channel_app.route('/:name/')
def status(name):

    # http://api.met.no/weatherapi/locationforecastlts/1.1/
    # ?lat=60.10;lon=9.58;msl=70
    payload = {'lat': '60.10;lon=9.58;msl=70'}
    #r = requests.get("http://httpbin.org/get", params=payload)
    r = requests.get('http://api.met.no/weatherapi/locationforecastlts/1.1/?lat=60.10;lon=9.58;msl=70')

    print r.text

    return {
        'status': name
    }
