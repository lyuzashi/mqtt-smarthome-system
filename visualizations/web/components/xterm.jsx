import React, { Component } from 'react';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as attach from 'xterm/lib/addons/attach/attach';
import 'xterm/dist/xterm.css';

Terminal.applyAddon(attach);
Terminal.applyAddon(fit);

export default class XTerm extends Component {
  componentDidMount() {
    const url = new URL('repl', window.location.href);
    url.protocol = url.protocol.replace('http', 'ws');
    this.socket = new WebSocket(url.href);
    this.term = new Terminal();
    this.term.open(this.container);
    this.term.fit();
    this.term.attach(this.socket);
  }

  componentWillUnmount() {
    this.socket.close();
    this.term.destroy();
  }

  render() {
    return <div ref={container => (this.container = container)}></div>
  }
}