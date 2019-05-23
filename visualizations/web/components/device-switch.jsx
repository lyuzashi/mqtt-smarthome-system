import React, { Component, Fragment } from 'react';
import Pattern from 'mqtt-pattern';
import truthy from 'truthy';
import PushButton from './push-button';
import Slider from './slider';
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
    this.setState({
      [this.interface]: this.map(payload),
      // [`${this.interface}-target`]: this.map(payload),
    });
  }

  map(payload) {
    switch(this.props.style) {
      case 'checkbox':
        return truthy(payload);
      break;
      case 'range':
        return parseInt(payload, 10);
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
          console.log('publishing', event.target.value);
          publish(this.setTopic, String(parseInt(event.target.value, 10)));
        break;
      } 
      // this.setState({ [`${this.interface}-target`]: event.target.value });
    }
  }

  render() {
    const { props: { style, range: [min, max] = [0, 254] }, set } = this;
    const actualValue = this.state[this.interface];
    // const targetValue = this.state[`${this.interface}-target`];
    switch (style) {
      case 'checkbox':
        return (
          <PushButton on={actualValue} onClick={set} />
        );
      break;
      case 'range': 
        return (
          <Slider value={Number(actualValue)} onChange={set} min={min} max={max} />
        );
      break;
    }
  }
}
 
DeviceSwitch.defaultProps = {
  style: 'checkbox',
};
