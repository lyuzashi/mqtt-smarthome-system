import { randomBytes } from 'crypto';
export default () => randomBytes(16).toString('hex');
