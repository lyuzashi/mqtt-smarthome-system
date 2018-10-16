
import { fork } from 'child_process';

// const program = path.resolve('program.js');
// const parameters = [];
// const options = {
//   stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
// };

// const child = fork(program, parameters, options);

export default program => fork(program);
