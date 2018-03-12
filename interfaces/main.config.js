module.exports = {
  apps: [{
    name: 'dmx',
    script: require.resolve('mqtt-dmx-sequencer'),
    args: [
      '-u mqtt://bus'
    ]
  }, /* {
    name: 'hue',
    script: require.resolve('hue2mqtt'),
    args: [
      '-m mqtt://bus'
    ]
  }, */ {
    name: 'hue',
    script: require.resolve('airtunes2mqtt'),
    args: [
      '-u mqtt://bus',
      '-s LivingRoom:192.168.x.x:5000'
    ]
  }]
}