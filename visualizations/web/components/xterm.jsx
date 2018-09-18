import React, { Component } from 'react';
import { Terminal } from 'xterm';
import websocket from 'websocket-stream';
import 'xterm/dist/xterm.css';

var ws = websocket('ws://localhost:8080/repl')


console.log(ws);



export default class XTerm extends Component {
  componentDidMount() {
    this.term = new Terminal();
    this.term.open(this.container);
    this.term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
  
    this.term.on('key', (key, event) => {
      ws.write(key);
    });

    ws.on('data', (data) => this.term.write(data.toString()));
  }

  componentWillUnmount() {
    this.term.destroy();
  }

  render() {
    return <div ref={container => (this.container = container)}></div>
  }
}