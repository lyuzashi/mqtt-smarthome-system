/* WIFI geolocation of hub.
Aim to Use node-wifi and Google Geolocation API to store location of HAL9000 on 
startup if wifi networks have changed significantly (try avoid making too many calls to Geo)
then publish new location.

Uses semi-permanent storage which can hold known networks with their locations, so 
a scan can be matched against known locations. 
Matching refreshes expiry, known locations last for 6 months.
*/

import wifi from 'node-wifi';
import { promisify } from 'util';
import getKey from '../../config/keys'
import Device from '../device';
import ExpiringList, { sixMonths } from '../../system/common/expiring-list';

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

  static async getLocation({ wifiAccessPoints }) {
    const key = await getKey('google-geolocation-key');
    console.log('Looking up location with key', key);
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
    for (const known of this.known.items()) {
      const signalStrength = HubLocation.significantChange(wifiAccessPoints, known.wifiAccessPoints);
      if (signalStrength < 70) {
        this.known.expire(known, sixMonths());
        return known.location;
        break;
      }
    }
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
    {...


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