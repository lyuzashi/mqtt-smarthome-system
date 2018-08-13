import Bonjour from 'bonjour';
import shutdown from './shutdown';

// This opens a Socket but it's stored privately
const mDNS = Bonjour({
  multicast: true,
});

shutdown.on('exit', () => {
  mDNS.unpublishAll();
  mDNS.destroy();
})

export default mDNS;
