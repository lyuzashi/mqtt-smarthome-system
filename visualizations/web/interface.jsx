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

class NamedTabs extends Component {
  render() {
    this.names = this.props.children.map(c => c.props.name); 
    return this.props.children;
  }
}

const Interface = () => {
  const namedTabs = useRef();
  const [tab, setTab] = useState(0);
  const location = useLocation();
  const history = useHistory();
  const names = namedTabs.current && namedTabs.current.names
  const indexes = names && names.reduce((accumulator, value, key) =>
    Object.assign(accumulator, { [value]: key }), {});

  console.log(names, indexes, namedTabs.current);

  useEffect(() => {
    names && setTab(indexes[location.pathname]);
  });
  return (
    <Fragment>
      <Body />
      <Tabs selectedIndex={tab} onSelect={i => setTab(i)}> 
        <TabList>
          <Tab>🎛</Tab>
          <Tab>⌨️</Tab>
        </TabList>
        <NamedTabs ref={namedTabs}>
          <TabPanel name="/config">
            <Controls />
          </TabPanel>
          <PersistentTabPanel name="/terminal">
            <PanelGroup direction="column" borderColor="grey">
                <Config />
                <XTerm />
              </PanelGroup>
          </PersistentTabPanel>
        </NamedTabs>
      </Tabs>
    </Fragment>
  );
}

export default () => (
    <Router>
      <Interface />
    </Router>
  );

