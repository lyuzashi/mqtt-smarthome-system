import React, { Component } from 'react';
import Pattern from 'mqtt-pattern';
import truthy from 'truthy';
import PushButton from './push-button';
import { publish, subscribe, unsubscribe } from '../mqtt-client';

const smarthomeTopic = '+toplevelname/+method/+item/#interfaces';

export default class DeviceSwitch extends Component {
  constructor(props) {
    super(props);
    const { top: toplevelname, item, interfaces } = props;
    const topicParts = { toplevelname, item, interfaces };
    this.statusTopic = Pattern.fill(smarthomeTopic, { ...topicParts, method: 'status' });
    this.getTopic = Pattern.fill(smarthomeTopic, { ...topicParts, method: 'get' });
    this.setTopic = Pattern.fill(smarthomeTopic, { ...topicParts, method: 'set' });
    this.interface = Array.isArray(interfaces) ? interfaces.join('/') : interfaces;
    this.state = { [this.interface]: false };
    this.update = this.update.bind(this);
    this.set = this.set.bind(this);
  }

  componentDidMount() {
    subscribe(this.statusTopic)(this.update);
  }

  componentWillUnmount() {
    unsubscribe(this.statusTopic, this.update);
  }

  update(payload) {
    const { interfaces } = this.props;
    this.setState({ [this.interface]: this.map(payload) });
  }

  map(payload) {
    switch(this.props.style) {
      case 'checkbox':
        return truthy(String(payload));
      break;
      case 'range':
        return payload;
      break;
    } 
  }

  set(event) {
    if(event.target) {
      switch(this.props.style) {
        case 'checkbox':
          if(event.target.checked === undefined) {
            publish(this.setTopic, !this.state[this.interface] ? '1' : '0');
          } else {
            publish(this.setTopic, event.target.checked ? '1' : '0');
          }
        break;
        case 'range':
          publish(this.setTopic, event.target.value);
        break;
      } 
    }
  }

  render() {
    const { props: { style }, set } = this;
    switch (style) {
      case 'checkbox':
        return (
          <PushButton on={this.state[this.interface]} onClick={set} />
        );
      break;
      case 'range': 
        return (
          <input type="range" onChange={set} value={this.state[this.interface]} />
        );
      break;
    }
  }
}
 
DeviceSwitch.defaultProps = {
  style: 'checkbox',
};
