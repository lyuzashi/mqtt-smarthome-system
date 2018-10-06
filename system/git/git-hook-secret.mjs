import getRandomId from '../common/random-id';
import { get, set } from '../../config/keys';


export default (async () => {
  const exisitingSecret = await get('secret');
  if (exisitingSecret) return exisitingSecret;
  const secret = getRandomId();
  await set({ secret });
  return secret;
})(); 
