import requests
import lxml
from lxml import etree

class Wheater(object):

    def get_data(ele, name, value):
        if ele is not None:
            v = e.attrib.get(value)
            data['temperature'] = v

    def normalize(self, value,low1,high1,low2=0,high2=100):
        value = float(value)
        return int(float(value-low1)/(high1-low1)*(high2-low2)+low2)

    def fetch(self, lat, lon):
        r = requests.get('http://api.met.no/weatherapi/locationforecastlts/1.1/?lat=60.10;lon=9.58;msl=70')
        root = etree.fromstring(r.text)

        data = {}
        for time in root.iter("time"):
            location_ele = time.find('location')

            if 'temperature' not in data:
                ele = location_ele.find('temperature')
                if ele is not None:
                    v = ele.attrib.get('value')
                    data['temperature'] = self.normalize(v, -10, 20)
            if 'wind_direction' not in data:
                ele = location_ele.find('windDirection')
                if ele is not None:
                    v = ele.attrib.get('deg')
                    data['wind_direction'] = self.normalize(v, 0, 360)
            if 'cloudiness' not in data:
                ele = location_ele.find('cloudiness')
                if ele is not None:
                    v = ele.attrib.get('percent')
                    data['cloudiness'] = self.normalize(v, 0, 100)
            if 'pressure' not in data:
                ele = location_ele.find('pressure')
                if ele is not None:
                    v = ele.attrib.get('value')
                    data['pressure'] = self.normalize(v, 700, 1500)





            #<temperature id="TTT" unit="celcius" value="11.2"/>
            #<windDirection id="dd" deg="198.5" name="S"/>
            #<windSpeed id="ff" mps="1.9" beaufort="1" name="Flau vind"/>
            #<humidity value="33.7" unit="percent"/>
            #<pressure id="pr" unit="hPa" value="1017.0"/>
            #<cloudiness id="NN" percent="98.9"/>
            #<fog id="FOG" percent="0.0"/>
            #<lowClouds id="LOW" percent="0.0"/>
            #<mediumClouds id="MEDIUM" percent="1.6"/>
            #<highClouds id="HIGH" percent="98.8"/>

            if len(data) == 2:
                return data

        return data





if __name__ == "__main__":
    w = Wheater()
    d = w.fetch('60.10', '9.58')
    print d

    v = 255/2
    v = w.normalize(v, 0, 255)
    print v




