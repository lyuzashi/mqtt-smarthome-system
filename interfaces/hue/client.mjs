import hue from 'huejay';
import keys, { set } from '../../config/keys';
import repl from '../../visualizations/web/repl';

const client = (async () => {
  const { 'hue-username': username, 'hue-ip': lastKnownIP } = await keys;
  // Ping stored IP address if there is one, failing either case discover first bridge on network
  const host = (lastKnownIP && await new hue.Client({ host: lastKnownIP })
    .bridge.ping().catch(() => false) && lastKnownIP) || ((await hue.discover())[0].ip);
  await set('hue-ip', host);

  const client = new hue.Client({ username, host });

  // Test authentication and create user if it fails
  try {
    await client.bridge.isAuthenticated();
  } catch (unauthenticatedError) {
    const newUser = new client.users.User({ deviceType: 'mqtt-smarthome-system' });
    let user;
    do {
      user = await client.users.create(newUser).catch(error =>
        (error instanceof hue.Error && error.type === 101) ? false : Promise.reject(error));
      await new Promise(resolve => setTimeout(resolve, 5000));
    } while(!user);
    client.username = user.username;
    await set('hue-username', user.username);
  }

  return client;
})();

client.then(hue => repl.hue = hue);

export default client;