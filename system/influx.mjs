import Influx from 'influx';
import mqtt from 'mqtt';

const influx = new Influx.InfluxDB();
const database = 'mqtt-smarthome-system';

(async () => {
  const currentDatabases = await influx.getDatabaseNames();
  if (!currentDatabases.includes(database)) {
    await influx.createDatabase(database);
  }
  mqtt.on('published', ({ topic, payload }) => {
    const [toplevelname, method, item,  ...interfaces] = topic.split('/');
    const value = parseInt(payload.toString());

    influx.writePoints([{
        measurement: method,
        tags: { toplevelname, item },
        fields: {
          [interfaces.join('/')]: value
        },
    }], { database });

  })
})();
