import React, { Component, Fragment } from 'react';
import PanelGroup from 'react-panelgroup';
import Body from './components/body';
import XTerm from './components/xterm';

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Body />
        <PanelGroup direction="column">
          <div>Something else</div>
          <div style={{width: '100%', height: '100%'}}>
            <XTerm />
          </div>
        </PanelGroup>
      </Fragment>
    );
  }
}