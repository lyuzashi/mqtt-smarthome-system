import React, { Component } from 'react';
import Body from './components/body';
import XTerm from './components/xterm';

export default class App extends Component {
  render() {
    return <div>
      <Body />
      <XTerm />
    </div>
  }
}