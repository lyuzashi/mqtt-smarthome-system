import React, { Component } from 'react';
import { Terminal } from 'xterm';
import styled from 'styled-components';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as attach from 'xterm/lib/addons/attach/attach';
import 'xterm/dist/xterm.css';

Terminal.applyAddon(attach);
Terminal.applyAddon(fit);

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: black;
`;

export default class XTerm extends Component {
  componentDidMount() {
    const url = new URL('repl', window.location.href);
    url.protocol = url.protocol.replace('http', 'ws');
    this.socket = new WebSocket(url.href);
    this.term = new Terminal({
      allowTransparency: true,
      convertEol: true,
      cursorBlink: true,
      fontSize: 12,
      fontFamily: 'Monaco',
      theme: {
        background: 'transparent',
      }
    });
    this.term.open(this.container);
    this.term.fit();
    this.term.attach(this.socket);
  }

  componentWillUnmount() {
    this.socket.close();
    this.term.destroy();
  }

  render() {
    // TODO watch resize of container and call fit
    return <Container ref={container => (this.container = container)} />
  }
}