import noble from '@abandonware/noble';
// import Peripheral from 'noble/lib/peripheral';
// import { promisify } from 'util';

// Peripheral.prototype.connect = promisify(Peripheral.prototype.connect);
// Peripheral.prototype.discoverServices = promisify(Peripheral.prototype.discoverServices);
// noble.discoverCharacteristics = promisify(noble.discoverCharacteristics);

// TODO add layer to find multiple interfaces and select whichever has highest signal

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    console.log('Scanning');
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

const peripherals = new Set();

const gatherData = async () => {
  noble.stopScanning();
  console.log('Done');
  for (const [peripheral] of peripherals.entries()) {
    await explore(peripheral);
  }
};

// setTimeout(gatherData, 5000);


noble.on('discover', async function(peripheral) {
  peripherals.add(peripheral);
  gatherData();
});

const explore = async peripheral => {
  try {
    console.log('connecting to', peripheral.uuid);
    // await peripheral.connect();
    peripheral.connect((err) => {
      console.log('connected.', err, peripheral);
      // peripheral.discoverAllServicesAndCharacteristics((err, services, characteristics) => {
      //   services.find(({ type }) => type == 'org.bluetooth.characteristic.model_number_string').read((err, data) => {
      //     console.log('discovered.', err)
          peripheral.disconnect(() => {
            console.log('Disconnected.', /*services, characteristics, data*/);
          });
      //   })
      // });
    });
    // console.log(peripheral);
    // const services = await peripheral.discoverServices();
    // console.log(services);
  } catch (e) {
    console.log(e);
  }
};
    //     var serviceIndex = 0;

    //     async.whilst(
    //       function () {
    //         return (serviceIndex < services.length);
    //       },
    //       function(callback) {
    //         var service = services[serviceIndex];
    //         var serviceInfo = service.uuid;

    //         if (service.name) {
    //           serviceInfo += ' (' + service.name + ')';
    //         }
    //         console.log(serviceInfo);

    //         service.discoverCharacteristics([], function(error, characteristics) {
    //           var characteristicIndex = 0;

    //           async.whilst(
    //             function () {
    //               return (characteristicIndex < characteristics.length);
    //             },
    //             function(callback) {
    //               var characteristic = characteristics[characteristicIndex];
    //               var characteristicInfo = '  ' + characteristic.uuid;

    //               if (characteristic.name) {
    //                 characteristicInfo += ' (' + characteristic.name + ')';
    //               }

    //               async.series([
    //                 function(callback) {
    //                   characteristic.discoverDescriptors(function(error, descriptors) {
    //                     async.detect(
    //                       descriptors,
    //                       function(descriptor, callback) {
    //                         if (descriptor.uuid === '2901') {
    //                           return callback(descriptor);
    //                         } else {
    //                           return callback();
    //                         }
    //                       },
    //                       function(userDescriptionDescriptor){
    //                         if (userDescriptionDescriptor) {
    //                           userDescriptionDescriptor.readValue(function(error, data) {
    //                             if (data) {
    //                               characteristicInfo += ' (' + data.toString() + ')';
    //                             }
    //                             callback();
    //                           });
    //                         } else {
    //                           callback();
    //                         }
    //                       }
    //                     );
    //                   });
    //                 },
    //                 function(callback) {
    //                       characteristicInfo += '\n    properties  ' + characteristic.properties.join(', ');

    //                   if (characteristic.properties.indexOf('read') !== -1) {
    //                     characteristic.read(function(error, data) {
    //                       if (data) {
    //                         var string = data.toString('ascii');

    //                         characteristicInfo += '\n    value       ' + data.toString('hex') + ' | \'' + string + '\'';
    //                       }
    //                       callback();
    //                     });
    //                   } else {
    //                     callback();
    //                   }
    //                 },
    //                 function() {
    //                   console.log(characteristicInfo);
    //                   characteristicIndex++;
    //                   callback();
    //                 }
    //               ]);
    //             },
    //             function(error) {
    //               serviceIndex++;
    //               callback();
    //             }
    //           );
    //         });
    //       },
    //       function (err) {
    //         peripheral.disconnect();
    //       }
    //     );
    //   });
    // });

      
// }
