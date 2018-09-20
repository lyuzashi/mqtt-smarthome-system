import React, { Component } from 'react';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as attach from 'xterm/lib/addons/attach/attach';
import websocket from 'websocket-stream';
import 'xterm/dist/xterm.css';

Terminal.applyAddon(attach);
Terminal.applyAddon(fit);

var ws = new WebSocket('ws://localhost:8080/repl')


console.log(ws);



export default class XTerm extends Component {
  componentDidMount() {
    this.term = new Terminal();
    this.term.open(this.container);

    this.term.fit();

    this.term.attach(ws);
  }

  componentWillUnmount() {
    this.term.destroy();
  }

  render() {
    return <div ref={container => (this.container = container)}></div>
  }
}