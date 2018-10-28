import Influx from 'influx';
import Pattern from 'mqtt-pattern';
import matchr from 'matchr';
import YAML from 'yamljs';
import path from 'path';
import root from '../root';
import mqtt from './mqtt';

const config = YAML.load(path.resolve(root, 'config/influx.yml'));

const influx = new Influx.InfluxDB();
const { database, smarthomeTopic, map } = config;
const overrides = new Set();
const overridden = new Map();

const mapMessage = (topic, value) => {
  const mapper = map.find(({ from, to }) => matchr({ ...topic, value }, from));
  if (mapper) {
    const overrideTopic = Pattern.fill(smarthomeTopic, { ...topic, ...mapper.to });
    if (mapper.to.override) {
      overrides.add(overrideTopic);
    }
    if (mapper.to.restore) {
      value = overridden.get(overrideTopic);
      overrides.delete(overrideTopic);
    }
  }
  return { ...topic, value, ...(mapper && mapper.to) };
};

(async () => {
  const currentDatabases = await influx.getDatabaseNames();
  if (!currentDatabases.includes(database)) await influx.createDatabase(database);
  mqtt.on('published', ({ topic, payload }) => {
    const smarthomeMessage = Pattern.exec(smarthomeTopic, topic);
    if (!smarthomeMessage) return;
    overridden.set(topic, payload);
    const { toplevelname, method, item, interfaces, value } = mapMessage(smarthomeMessage, payload);
    if (overrides.has(topic)) return;
    influx.writePoints([{
        measurement: method,
        tags: { toplevelname, item },
        fields: {
          [interfaces.join('/')]: parseInt(`${value}`)
        },
    }], { database });

  })
})();
