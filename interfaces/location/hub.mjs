/* WIFI geolocation of hub.
Aim to Use node-wifi and Google Geolocation API to store location of HAL9000 on 
startup if wifi networks have changed significantly (try avoid making too many calls to Geo)
then publish distance.

Needs some kind of semi-permanent storage which can hold known networks with their locations, so 
a scan can be matched against known locations. 
Matching refreshes expiry, known locations last for 6 months.
*/

import wifi from 'node-wifi';
import { promisify } from 'util';
import Device from '../device';
import ExpiringList, { sixMonths } from '../../system/common/expiring-list';

export const locations = {
  homeA: [
    {
      "macAddress": "14:5f:94:6b:7a:54",
      "signalStrength": -84,
      "channel": 100
    },
    {
      "macAddress": "12:13:31:1f:29:0f",
      "signalStrength": -87,
      "channel": 52
    },
    {
      "macAddress": "10:13:31:1f:29:07",
      "signalStrength": -76,
      "channel": 11
    },
    {
      "macAddress": "94:10:3e:bc:e4:f6",
      "signalStrength": -69,
      "channel": 11
    },
    {
      "macAddress": "bc:30:d9:da:84:26",
      "signalStrength": -57,
      "channel": 11
    },
    {
      "macAddress": "34:e8:94:7c:c9:e7",
      "signalStrength": -85,
      "channel": 9
    },
    {
      "macAddress": "34:e8:94:2b:ed:cc",
      "signalStrength": -52,
      "channel": 7
    },
    {
      "macAddress": "50:d4:f7:2c:34:ac",
      "signalStrength": -84,
      "channel": 5
    },
    {
      "macAddress": "3c:67:8c:75:1b:70",
      "signalStrength": -74,
      "channel": 4
    },
    {
      "macAddress": "70:8b:cd:cf:6a:58",
      "signalStrength": -86,
      "channel": 4
    },
    {
      "macAddress": "34:e8:94:7c:cd:b3",
      "signalStrength": -61,
      "channel": 2
    },
    {
      "macAddress": "fa:ab:05:b5:2a:c9",
      "signalStrength": -71,
      "channel": 1
    },
    {
      "macAddress": "20:b0:01:8d:e8:ab",
      "signalStrength": -59,
      "channel": 1
    },
    {
      "macAddress": "fa:ab:05:b5:2a:c8",
      "signalStrength": -55,
      "channel": 1
    },
    {
      "macAddress": "14:5f:94:6b:7a:50",
      "signalStrength": -61,
      "channel": 1
    },
    {
      "macAddress": "f8:ab:05:9d:5e:21",
      "signalStrength": -84,
      "channel": 149
    },
    {
      "macAddress": "bc:30:d9:ac:58:16",
      "signalStrength": -82,
      "channel": 44
    },
    {
      "macAddress": "bc:30:d9:da:84:25",
      "signalStrength": -70,
      "channel": 44
    },
    {
      "macAddress": "34:e8:94:2b:ed:ce",
      "signalStrength": -64,
      "channel": 44
    },
    {
      "macAddress": "22:b0:01:8d:e8:b3",
      "signalStrength": -77,
      "channel": 40
    },
    {
      "macAddress": "18:e8:29:15:63:4a",
      "signalStrength": -73,
      "channel": 36
    },
    {
      "macAddress": "bc:30:d9:ba:9b:e7",
      "signalStrength": -83,
      "channel": 157
    },
    {
      "macAddress": "18:e8:29:15:5f:67",
      "signalStrength": -52,
      "channel": 157
    },
    {
      "macAddress": "34:e8:94:7c:cd:b5",
      "signalStrength": -79,
      "channel": 157
    }
  ],
  homeB: [ { macAddress: '14:5f:94:6b:7a:54',
  signalStrength: -80,
  channel: 100 },
{ macAddress: 'a8:e5:44:dc:ad:22',
  signalStrength: -87,
  channel: 52 },
{ macAddress: '12:13:31:1f:29:0f',
  signalStrength: -86,
  channel: 52 },
{ macAddress: '72:30:d9:ac:58:13',
  signalStrength: -79,
  channel: 11 },
{ macAddress: '72:30:d9:ac:58:12',
  signalStrength: -87,
  channel: 11 },
{ macAddress: '12:13:31:1f:29:0a',
  signalStrength: -77,
  channel: 11 },
{ macAddress: '10:13:31:1f:29:07',
  signalStrength: -76,
  channel: 11 },
{ macAddress: 'bc:30:d9:ac:58:17',
  signalStrength: -65,
  channel: 11 },
{ macAddress: '4c:60:de:39:4f:ee',
  signalStrength: -78,
  channel: 11 },
{ macAddress: '94:10:3e:bc:e4:f6',
  signalStrength: -69,
  channel: 11 },
{ macAddress: 'e2:d0:12:79:3e:4c',
  signalStrength: -50,
  channel: 11 },
{ macAddress: 'fa:ab:05:9d:5e:21',
  signalStrength: -77,
  channel: 7 },
{ macAddress: 'f8:ab:05:9d:5e:20',
  signalStrength: -77,
  channel: 7 },
{ macAddress: '34:e8:94:2b:ed:cc',
  signalStrength: -52,
  channel: 7 },
{ macAddress: 'fa:ab:05:b5:2a:c9',
  signalStrength: -58,
  channel: 6 },
{ macAddress: 'fa:ab:05:b5:2a:c8',
  signalStrength: -57,
  channel: 6 },
{ macAddress: 'bc:30:d9:da:84:26',
  signalStrength: -48,
  channel: 6 },
{ macAddress: 'bc:30:d9:d7:f4:1d',
  signalStrength: -78,
  channel: 6 },
{ macAddress: '50:d4:f7:2c:34:ac',
  signalStrength: -78,
  channel: 3 },
{ macAddress: '78:65:59:51:a7:40',
  signalStrength: -70,
  channel: 1 },
{ macAddress: '14:5f:94:6b:7a:50',
  signalStrength: -69,
  channel: 1 },
{ macAddress: '34:e8:94:7c:cd:b3',
  signalStrength: -56,
  channel: 2 },
{ macAddress: '18:90:d8:65:4c:1f',
  signalStrength: -77,
  channel: 1 },
{ macAddress: '80:20:da:a0:13:dc',
  signalStrength: -77,
  channel: 1 },
{ macAddress: '20:b0:01:8d:e8:ab',
  signalStrength: -72,
  channel: 1 },
{ macAddress: '70:0b:01:3f:b0:2a',
  signalStrength: -87,
  channel: 1 },
{ macAddress: 'b8:ee:0e:9e:2a:5f',
  signalStrength: -87,
  channel: 149 },
{ macAddress: 'b8:ee:0e:9e:75:de',
  signalStrength: -89,
  channel: 149 },
{ macAddress: 'a6:91:b1:61:dd:51',
  signalStrength: -89,
  channel: 149 },
{ macAddress: 'f8:ab:05:b4:33:2b',
  signalStrength: -85,
  channel: 149 },
{ macAddress: 'f8:ab:05:b5:2a:cc',
  signalStrength: -80,
  channel: 149 },
{ macAddress: 'bc:30:d9:da:84:25',
  signalStrength: -75,
  channel: 44 },
{ macAddress: 'a6:91:b1:ac:06:13',
  signalStrength: -87,
  channel: 44 },
{ macAddress: '34:e8:94:2b:ed:ce',
  signalStrength: -65,
  channel: 44 },
{ macAddress: '22:b0:01:8d:e8:b3',
  signalStrength: -79,
  channel: 40 },
{ macAddress: '18:e8:29:15:63:4a',
  signalStrength: -72,
  channel: 36 },
{ macAddress: '18:e8:29:15:5f:67',
  signalStrength: -47,
  channel: 157 },
{ macAddress: '34:e8:94:7c:cd:b5',
  signalStrength: -75,
  channel: 157 } ],
  balmoralA: [ { macAddress: '38:94:ed:0c:92:2f',
  signalStrength: -86,
  channel: 8 },
{ macAddress: 'fc:ec:da:1e:83:91',
  signalStrength: -87,
  channel: 149 },
{ macAddress: '58:ef:68:33:d5:55',
  signalStrength: -88,
  channel: 9 },
{ macAddress: '72:30:d9:b8:8c:2f',
  signalStrength: -88,
  channel: 2 },
{ macAddress: '72:30:d9:b8:8c:28',
  signalStrength: -89,
  channel: 2 } ],
  balmoralB: [ { macAddress: 'a6:91:b1:68:ef:c7',
  signalStrength: -84,
  channel: 52 },
{ macAddress: 'fc:ec:da:1e:83:91',
  signalStrength: -86,
  channel: 149 },
{ macAddress: 'bc:30:d9:b4:b4:ac',
  signalStrength: -84,
  channel: 149 },
{ macAddress: 'bc:30:d9:b4:b4:ad',
  signalStrength: -88,
  channel: 6 } ],
}

export default class HubLocation extends Device {
  constructor({ id = null, ...options }) {
    super(options);
    wifi.init({ iface: id });
    this.wifiScan = promisify(wifi.scan);
    this.known = new ExpiringList({ name: 'hub-location' });
  }

  // Average signal strength difference across all matching networks, with a theoretical maximum of
  // -90dBm, which is an effectively unreachable signal strength. Anything above 70 is close enough
  static significantChange(a, b) {
    const comp =  [...a, ...b].reduce((compare, network) => {
      const match = compare.find(({ macAddress, channel }) =>
        network.macAddress === macAddress && network.channel === channel);
      if (match) {
        match.difference = Math.abs(match.signalStrength - network.signalStrength);
      } else {
        compare.push({ difference: 90, ...network });
      }
      return compare;
    }, [])
    return comp.reduce((sum, network) => sum + network.difference, 0) / comp.length;
  }

  async scan() {
    const networks = await this.wifiScan();
    return networks.map(network => ({
      macAddress: network.mac,
      signalStrength: parseInt(network.signal_level),
      channel: network.channel
    }))
  }

  async get() {
    const wifiAccessPoints = await this.scan();

    // Wait for expiring list to load data?
    await this.known.loaded;

    // Iterate through list and compare with significantChange
    // first one with <70 is a match 
    for (const known of this.known.items()) {
      const signalStrength = HubLocation.significantChange(wifiAccessPoints, known.wifiAccessPoints);
      if (signalStrength < 70) {
        
        this.known.expire(known, sixMonths());
        return known.location;
        break;
      }
    }

    // Call Geolocation API
    const { location, accuracy } = getLocation({ wifiAccessPoints });
    
    this.known.add({ location, accuracy, wifiAccessPoints });

    return location;
  }

  cached() {

  }

}


/*
POST https://www.googleapis.com/geolocation/v1/geolocate?key=XXXXX
Content-Type: application/json

{
  "wifiAccessPoints": [
    {
      "macAddress": "14:5f:94:6b:7a:54",
      "signalStrength": -84,
      "channel": 100
    },
    {
      "macAddress": "12:13:31:1f:29:0f",
      "signalStrength": -87,
      "channel": 52
    },
    {
      "macAddress": "10:13:31:1f:29:07",
      "signalStrength": -76,
      "channel": 11
    },
    {
      "macAddress": "94:10:3e:bc:e4:f6",
      "signalStrength": -69,
      "channel": 11
    },
    {
      "macAddress": "bc:30:d9:da:84:26",
      "signalStrength": -57,
      "channel": 11
    },
    {
      "macAddress": "34:e8:94:7c:c9:e7",
      "signalStrength": -85,
      "channel": 9
    },
    {
      "macAddress": "34:e8:94:2b:ed:cc",
      "signalStrength": -52,
      "channel": 7
    },
    {
      "macAddress": "50:d4:f7:2c:34:ac",
      "signalStrength": -84,
      "channel": 5
    },
    {
      "macAddress": "3c:67:8c:75:1b:70",
      "signalStrength": -74,
      "channel": 4
    },
    {
      "macAddress": "70:8b:cd:cf:6a:58",
      "signalStrength": -86,
      "channel": 4
    },
    {
      "macAddress": "34:e8:94:7c:cd:b3",
      "signalStrength": -61,
      "channel": 2
    },
    {
      "macAddress": "fa:ab:05:b5:2a:c9",
      "signalStrength": -71,
      "channel": 1
    },
    {
      "macAddress": "20:b0:01:8d:e8:ab",
      "signalStrength": -59,
      "channel": 1
    },
    {
      "macAddress": "fa:ab:05:b5:2a:c8",
      "signalStrength": -55,
      "channel": 1
    },
    {
      "macAddress": "14:5f:94:6b:7a:50",
      "signalStrength": -61,
      "channel": 1
    },
    {
      "macAddress": "f8:ab:05:9d:5e:21",
      "signalStrength": -84,
      "channel": 149
    },
    {
      "macAddress": "bc:30:d9:ac:58:16",
      "signalStrength": -82,
      "channel": 44
    },
    {
      "macAddress": "bc:30:d9:da:84:25",
      "signalStrength": -70,
      "channel": 44
    },
    {
      "macAddress": "34:e8:94:2b:ed:ce",
      "signalStrength": -64,
      "channel": 44
    },
    {
      "macAddress": "22:b0:01:8d:e8:b3",
      "signalStrength": -77,
      "channel": 40
    },
    {
      "macAddress": "18:e8:29:15:63:4a",
      "signalStrength": -73,
      "channel": 36
    },
    {
      "macAddress": "bc:30:d9:ba:9b:e7",
      "signalStrength": -83,
      "channel": 157
    },
    {
      "macAddress": "18:e8:29:15:5f:67",
      "signalStrength": -52,
      "channel": 157
    },
    {
      "macAddress": "34:e8:94:7c:cd:b5",
      "signalStrength": -79,
      "channel": 157
    }
  ]
}


//// Balmoral Scan 1
[ { macAddress: '38:94:ed:0c:92:2f',
    signalStrength: -86,
    channel: 8 },
  { macAddress: 'fc:ec:da:1e:83:91',
    signalStrength: -87,
    channel: 149 },
  { macAddress: '58:ef:68:33:d5:55',
    signalStrength: -88,
    channel: 9 },
  { macAddress: '72:30:d9:b8:8c:2f',
    signalStrength: -88,
    channel: 2 },
  { macAddress: '72:30:d9:b8:8c:28',
    signalStrength: -89,
    channel: 2 } ]

// Scan 2
    [ { macAddress: 'a6:91:b1:68:ef:c7',
    signalStrength: -84,
    channel: 52 },
  { macAddress: 'fc:ec:da:1e:83:91',
    signalStrength: -86,
    channel: 149 },
  { macAddress: 'bc:30:d9:b4:b4:ac',
    signalStrength: -84,
    channel: 149 },
  { macAddress: 'bc:30:d9:b4:b4:ad',
    signalStrength: -88,
    channel: 6 } ]


HTTP/1.1 200 OK
Content-Type: application/json; charset=UTF-8
Vary: Origin, X-Origin, Referer
Content-Encoding: gzip
Date: Wed, 06 Nov 2019 23:34:45 GMT
Server: scaffolding on HTTPServer2
Cache-Control: private
X-XSS-Protection: 0
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Alt-Svc: quic=":443"; ma=2592000; v="46,43",h3-Q049=":443"; ma=2592000,h3-Q048=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000
Connection: close
Transfer-Encoding: chunked

{
  "location": {
    "lat": -33.8381334,
    "lng": 151.220662
  },
  "accuracy": 87
}
*/