import React, { Component } from 'react';
import Pattern from 'mqtt-pattern';
import truthy from 'truthy';
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
    this.setState({ [this.interface]: truthy(String(payload)) });
  }

  set(event) {
    if(event.target) {
      publish(this.setTopic, event.target.checked ? '1' : '0');
    }
  }

  render() {
    const { props, set } = this;
    return (
      <input type="checkbox" checked={this.state[this.interface]} onChange={set} />
    );
  }
}
 