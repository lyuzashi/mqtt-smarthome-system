import truthy from 'truthy';

export default {
  on: {
    map: truthy,
    fix(light, lights) {
      switch(light.manufacturer) {
        case 'OSRAM':
          if (light.on === false) {
            lights.save(light);
            light.transitionTime = 0;
          }
        break;
      }
    }
  }, // truthy or falsy
  // TODO bound by range to allow out of bound maxing out
  brightness: { map: Number }, // 0-254 (%)
  hue: { map: Number }, // 0-65535 (degrees * ~182.04 [65535/360º])
  saturation: { map: Number }, // 0-254 (%)
  colorTemp: { map: Number }, // 153-500 (mired, convert to kelvin or rgb with color.mjs)
  transitionTime: { map: Number, stateless: true }, // 0-5s - seems like it can be over 900!
  alert: { map: () => 'select' }, // Only used for identifying
  reachable: { immutable: true }, // true or false TODO use this to set error state immediately rather than timing out
  colorMode: { immutable: true }, // (e.g. ct, xy, hs)
};
