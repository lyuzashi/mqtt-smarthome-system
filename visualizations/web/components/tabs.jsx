import React, { Component } from 'react';
import {
  Tab as ReactTab,
  Tabs as ReactTabs,
  TabList as ReactTabList,
  TabPanel as ReactTabPanel,
} from 'react-tabs';
import styled, { css } from 'styled-components';
import Button from './button';

export const Tab = styled(ReactTab)`
  width: 1.2em;
  height: 1.2em;
  font-size: 1.6em;
  vertical-align: center;
  text-align: center;
  margin: 0.1em;
  cursor: pointer;
  ${props => !props.selected && css`
    filter: saturate(0);
    opacity: 0.4;
  `}
  :hover {
    opacity: 1;
  }
`;

export const Tabs = styled(ReactTabs)`
  display: flex;
  width: 100%;
  height: 100%;
`

export const TabList = styled(ReactTabList)`
  flex-basis: 50px;
  margin: 0;
  padding: 0.4em;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
`;

export const TabPanel = styled(ReactTabPanel)`
  ${props => !props.selected && css`
    visibility: hidden;
    position: absolute;
    z-index: -1;
  `}
  flex-grow: 1;
`;

export class PersistentTabPanel extends ReactTabPanel {
  constructor(...args) {
    super(...args);
    this.state = {
      openedOnce: false,
    }
    console.log(this);
  }

  render(...args) {
    console.log('render', args, this.state, this.props.selected);
    const { openedOnce } = this.state;
    return (<TabPanel {...this.props} forceRender={openedOnce} />)
  }
}

PersistentTabPanel.getDerivedStateFromProps = (props, state) => {
  if (!state.openedOnce && props.selected) {
    return { openedOnce: true }
  }
  return null;
}