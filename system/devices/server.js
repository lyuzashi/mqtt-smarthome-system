const YAML = require('yamljs');
const path = require('path');

const root = require('../../root');
const { build, registry, topicCast } = require('./build');

const devicesData = YAML.load(path.resolve(root, 'config/devices.yml'));

const types = YAML.load(path.resolve(root, 'config/types.yml'));
const characteristics = YAML.load(path.resolve(root, 'config/characteristics.yml'));

const devices = build({ devices: devicesData, types, characteristics });

module.exports = { registry, types, characteristics, devices, topicCast };