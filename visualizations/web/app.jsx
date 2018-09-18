import React, { Component } from 'react';
import XTerm from './components/xterm';

export default class App extends Component {
  render() {
    return <div>
      hello world!
      <XTerm></XTerm>
    </div>
  }
}