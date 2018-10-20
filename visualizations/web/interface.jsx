import React, { Component, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel, PersistentTabPanel } from './components/tabs';
import PanelGroup from 'react-panelgroup';
import Body from './components/body';
import Config from './components/config';
import XTerm from './components/xterm';

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Body />
        <Tabs onSelect={(id) => console.log('selected', id)}>
          <TabList>
            <Tab>🎛</Tab>
            <Tab>⌨️</Tab>
          </TabList>
          <TabPanel>
            Direct controls
          </TabPanel>
          <PersistentTabPanel>
            <PanelGroup direction="column" borderColor="grey">
              <Config />
              <div style={{width: '100%', height: '100%'}}>
                <XTerm />
              </div>
            </PanelGroup>
          </PersistentTabPanel>
        </Tabs>
      </Fragment>
    );
  }
}