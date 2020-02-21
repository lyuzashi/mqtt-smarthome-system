import React, { Component } from 'react';
import styled from 'styled-components';
import mqtt from '../mqtt-client';

const Name = styled.dt`
  font-size: 0.8em;
  color: #bbb;
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
`;

const CharacteristicDetail = styled.dl`

`;

const Value = styled.dd`
  font-size: 0.8em;
  color: #ccc;
  font-family: "Monaco",monospace;
  margin-left: 0.5em;
`;

export default class Characteristic extends Component {
  constructor(props) {
    super(props);
    this.statusTopic = this.props.methods.find(({ method }) => method === 'status').topic;
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    mqtt.subscribe(this.statusTopic, this.update);
  }

  componentWillUnmount() {
    mqtt.unsubscribe(this.statusTopic, this.update);
  }

  update(payload) {
    this.setState({
      value: payload
    });
  }

  render() {
    return (
      <CharacteristicDetail>
        <Name>{this.props.name}</Name>
        <Value>{this.state && this.state.value}</Value>
      </CharacteristicDetail>
    );
  }
}
