// export a function to spawn a child process with mqtt channel


const fork = require('child_process').fork;

const program = path.resolve('program.js');
const parameters = [];
const options = {
  stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
};

const child = fork(program, parameters, options);


const child = fork(program, parameters, options);
child.on('message', message => {
  console.log('message from child:', message);
  child.send('Hi');
});


// MQTT client inside process:

if (process.send) {
  process.send("Hello");
}

process.on('message', message => {
  console.log('message from parent:', message);
});