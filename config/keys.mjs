import https from 'https';

const url = 'https://kryten.grid.robotjamie.com/config/mqtt-smarthome-system.json';

export default new Promise((resolve, reject) => {
  https.get(url, response => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => resolve(JSON.parse(data)));
  })
  .on('error', error => reject(error));
});
