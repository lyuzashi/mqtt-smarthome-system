const { build, registry, topicCast } = require('./build');

const devicesData = require('../../config/devices.yml');
const types = require('../../config/types.yml');
const characteristics = require('../../config/characteristics.yml');

const devices = build({ devices: devicesData, types, characteristics });

module.exports = { registry, types, characteristics, devices, topicCast };