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
  brightness: { map: Number }, // 0-254
  hue: { map: Number }, // 0-65535
  saturation: { map: Number }, // 0-254
  colorTemp: { map: Number }, // 153-500
  transitionTime: { map: Number, stateless: true }, // 0-5s
  alert: { map: () => 'select' },
};
