import React, { Component } from 'react';
import styled, { css } from 'styled-components';

const PureButton = styled.button`
  color: #C1C1BA;
  background-color: #31342B;
  border: none;
  border-radius: 2px;
  font-size: 0.8em;
  margin: 0 0.1em;
  padding: 0.2em 0.5em;
  text-align: center;
  box-sizing: border-box;
  cursor: pointer;
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  ${props => props.busy && css`
    opacity: 0.6;
    pointer-events: none;
  `}
  :active {
    background-color: #39423D;
  }
`;

export default class Button extends Component {
  constructor(...args) {
    super(...args);
    this.state = { busy: false };
  }

  handleClick(event) {
    const { onClick } = this.props;
    if (typeof onClick !== 'function') return;
    const clickResponse = onClick(event);
    if (clickResponse instanceof Promise) {
      this.setState({ busy: true });
      clickResponse.then(() => {
        this.setState({ busy: false });
      })
    }
  }

  render() {
    const { busy } = this.state;
    return (
      <PureButton
        {...this.props}
        onClick={this.handleClick.bind(this)}
        busy={busy}
      />
    );
  }
};
