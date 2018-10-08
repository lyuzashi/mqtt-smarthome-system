import React, { Component, Fragment } from 'react';
import PanelGroup from 'react-panelgroup';
import Body from './components/body';
import XTerm from './components/xterm';
import FileBrowser from './components/file-browser';

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Body />
        <PanelGroup direction="column" borderColor="grey">
          <PanelGroup direction="row" borderColor="grey">
            <FileBrowser />
            <div>Something else</div>
          </PanelGroup>
          <div style={{width: '100%', height: '100%'}}>
            <XTerm />
          </div>
        </PanelGroup>
      </Fragment>
    );
  }
}