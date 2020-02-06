import React, { Component } from 'react';
import {  subscribe, unsubscribe } from '../mqtt-client';

export default class Characteristic extends Component {

  componentDidMount() {
    // TODO find status topic
    subscribe(this.props.topic)(this.update);
  }

  componentWillUnmount() {
    unsubscribe(this.props.topic, this.update);
  }

  update(payload) {
    this.setState({
      value: payload
    });
  }


  render() {
    return (<div>{this.state && this.state.value}</div>)
  }
}
