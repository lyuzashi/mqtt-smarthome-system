import selector from './selector';
import { context } from '../shell';

const { registry, types, characteristics, devices, topicCast } = selector;

context.devices = devices;

export default registry;
export { devices, types, characteristics, topicCast };
