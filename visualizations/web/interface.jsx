import React, { Component, Fragment } from 'react';
import PanelGroup from 'react-panelgroup';
import Body from './components/body';
import Config from './components/config';
import XTerm from './components/xterm';

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Body />
        <PanelGroup direction="column" borderColor="grey">
          <Config />
          <div style={{width: '100%', height: '100%'}}>
            <XTerm />
          </div>
        </PanelGroup>
      </Fragment>
    );
  }
}