import React, { Component, Fragment, useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, useLocation, useHistory } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel, PersistentTabPanel } from './components/tabs';
import PanelGroup from 'react-panelgroup';
import Controls from './components/controls';
import Body from './components/body';
import Config from './components/config';
import XTerm from './components/xterm';

/* export default class App extends Component {

  constructor(...args) {
    super(...args);
    this.tabs = {};
    this.state = { id: 0 };
  }

  select(id) {
    const name = Object.keys(this.tabs)[id];
    const component = Object.values(this.tabs)[id];
    console.log(this.state.id, name, component, id);
    this.setState({ id });
    // There is a render loop bug when using PersistentTabPanel
    return false;
  }

  render() {*/ 

const Interface = () => {
  const [tab, setTab] = useState(0);
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    console.log(location.pathname) // setTab from name
    setTab(location.pathname);
  }, [location]);
  useEffect(() => {
    // history.push(tab) // get tab name from index;
  });
  return (
    <Fragment>
      <Body />
      <Tabs selectedIndex={tab} onSelect={setTab}> 
        <TabList>
          <Tab>🎛</Tab>
          <Tab>⌨️</Tab>
        </TabList>
        <TabPanel>
          {/*  ref={tab => this.tabs['config'] = tab} */}
          <Controls />
        </TabPanel>
        <PersistentTabPanel>
          {/* ref={tab => this.tabs['terminal'] = tab}  */}
          <PanelGroup direction="column" borderColor="grey">
              <Config />
              <XTerm />
            </PanelGroup>
        </PersistentTabPanel>
      </Tabs>
    </Fragment>
  );
}

export default () => (
    <Router>
      <Interface />
    </Router>
  );

