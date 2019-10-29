import pigpio from 'pigpio-client';
import discover from '../../system/discover';

(async () => { 
  for await (const { addresses, port, name } of discover('gpio')) {
    const client = pigpio({ host: addresses[0], port });
    client.once('connected', () => {}); 
    console.log(addresses, port, name) 
  } 
})()
