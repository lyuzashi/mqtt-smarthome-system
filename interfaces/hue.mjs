import Hue from 'homebridge-hue';
import hap from 'hap-nodejs';


// API const filename = this.api.user.storagePath() + '/' + packageJson.name + '.json.gz'
// returns .homebridge dir https://github.com/nfarina/homebridge/blob/master/lib/user.js#L28

const options = {
  platform: 'Hue',
  users: { },
};

const platform = new Promise((resolve, reject) => {
  const homebridge = {
    hap,
    user: {
      storagePath() { return path.resolve('.') }
    },
    registerPlatform(id, name, platform) {
      resolve(new platform(console, options, homebridge));
    }
  }
  Hue(homebridge);
});


