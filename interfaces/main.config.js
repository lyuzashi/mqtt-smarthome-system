module.exports = {
  apps: [{
    name: 'dmx',
    script: require.resolve('mqtt-dmx-sequencer'),
    args: [
      '-u',
      'mqtt://localhost',
      '-a',
      '192.168.1.91'
    ]
  }, {
    name: 'hue',
    script: require.resolve('hue2mqtt'),
    args: [
      '-m',
      'mqtt://localhost'
    ]
  }]
}