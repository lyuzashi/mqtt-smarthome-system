import React, { Component, Fragment, useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, useLocation, useHistory, Redirect } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel, PersistentTabPanel } from './components/tabs';
import PanelGroup from 'react-panelgroup';
import Controls from './components/controls';
import Body from './components/body';
import Config from './components/config';
import XTerm from './components/xterm';
import Devices from './components/devices';
import Plan from './components/plan';

class TabPanelRoutes extends Component {
  render() {
    this.names = this.props.children.map(c => c.props.name); 
    return this.props.show === false ? null : this.props.children;
  }
}

const TabRoutes = ({ show, children }) => show === false ? null : children;

const useNames = (namedTabs) => {
  const [names, setNames] = useState();
  const [indexes, setIndexes] = useState();
  useEffect(() => {
    const namesValue = namedTabs.current && namedTabs.current.names
    const indexesValue = namesValue && namesValue.reduce((accumulator, value, key) =>
      Object.assign(accumulator, { [value]: key }), {});
    setNames(namesValue);
    setIndexes(indexesValue);
  }, [namedTabs]);
  return { names, indexes };
}

const Interface = () => {
  const namedTabs = useRef();
  const location = useLocation();
  const history = useHistory();
  const { names, indexes } = useNames(namedTabs);
  const [tab, setTab] = useState(undefined);

  useEffect(() => indexes && setTab(indexes[location.pathname] || 0), [location, indexes]);
  useEffect(() => {
    if (!names) return;
    const route = names[tab] || tab === undefined && names[0];
    history.push(route)
  }, [tab]);

  return (
    <Fragment>
      <Body />
      <Tabs selectedIndex={tab || 0 } onSelect={i => setTab(i)}>
        <TabList>
          <TabRoutes show={tab !== undefined}>
            <Tab>🎛</Tab>
            <Tab>⌨️</Tab>
            <Tab>🕹</Tab>
            <Tab>🗺</Tab>
            <Tab>🏡</Tab>
            <Tab>🎬</Tab>
          </TabRoutes>
        </TabList>
        <TabPanelRoutes ref={namedTabs} show={tab !== undefined}>
          <TabPanel name="/config">
            <Controls />
          </TabPanel>
          <PersistentTabPanel name="/terminal">
            <PanelGroup direction="column" borderColor="grey">
                <Config />
                <XTerm />
              </PanelGroup>
          </PersistentTabPanel>
          <TabPanel name="/devices">
            <Devices />
          </TabPanel>
          <TabPanel name="/geo">

          </TabPanel>
          <TabPanel name="/plan">
            <Plan></Plan>
          </TabPanel>
          <TabPanel name="/show">

          </TabPanel>
        </TabPanelRoutes>
      </Tabs>
    </Fragment>
  );
}

export default () => (
    <Router>
      <Interface />
    </Router>
  );

