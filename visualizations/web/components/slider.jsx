import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring'

// Use CSS vars for better performance
const Input = styled.input.attrs({
  style: props => ({ color: `hsl(${props.value * 360/255}, 100%, 50%)` })
})`
  width: 240px;
  position: relative;
  z-index: 1;
  appearance: none;
  border-radius: 0.5em;
  background-color: rgba(0,0,0,0.1);
  height: 0.5em;
  display: block;
  outline: none;
  transition: color 0.05s linear;
  background: linear-gradient(to right, rgb(255,0,0), rgb(255,255,0), rgb(0,255,0),rgb(0,255,255),rgb(0,0,255),rgb(255,0,255),rgb(255,0,0));
  &:focus{
    outline: none;
  }
  &:active,
  &:hover:active{
    cursor: grabbing;
    cursor: -webkit-grabbing;
  }
  &::-moz-range-track{
    appearance: none;
    opacity: 0;
    outline: none !important;
  }
  &::-ms-track{
    outline: none !important;
    appearance: none;
    opacity: 0;
  }

  &::-webkit-slider-thumb{
    height: 3em;
    width: 3em;
    border-radius: 2em;
    appearance: none;
    background: rgba(255, 255, 255, 0.65);
    cursor: pointer;
    cursor: move;
    cursor: grab;
    cursor: -webkit-grab;
    border: 0.4em solid currentColor;
    transition: border 0.1s ease-in-out,box-shadow 0.2s ease-in-out, transform 0.1s ease-in-out;
    box-shadow: 0 0.1em 0.1em rgba(0,0,0,0.05);
    &:active,
    &:hover:active{
      cursor: grabbing;
      cursor: -webkit-grabbing;
      transform: scale(0.975);
      box-shadow: 0 0 1px rgba(0,0,0,0.1);
      border: 1.5em solid currentColor;
    }
    &:hover{
      transform: scale(1.1);
      box-shadow: 0 0.4em 1em rgba(0,0,0,0.15);
    }
  }
  &::-moz-range-thumb{
    height: 3em;
    width: 3em;
    border-radius: 2em;
    appearance: none;
    background: rgba(255, 255, 255, 0.65);;
    border: 0.4em solid currentColor;
    cursor: pointer;
    cursor: move;
    cursor: grab;
    cursor: -webkit-grab;
    transition: box-shadow 0.2s ease-in-out, transform 0.1s ease-in-out;
    box-shadow: 0 1px 11px rgba(0,0,0,0);
    &:active,
    &:hover:active{
      cursor: grabbing;
      cursor: -webkit-grabbing;
      transform: scale(0.975);
      box-shadow: 0 0 1px rgba(0,0,0,0.1);
    }
    &:hover{
      transform: scale(1.1);
      box-shadow: 0 5px 15px rgba(0,0,0,0.15);
    }
  }
`;

const Progress = styled(animated.progress)`
  width: 240px;
`;

// export default class Slider extends Component {
//   constructor() {
//     super();
//     this.setValue = this.setValue.bind(this);
//     this.state = {
//       value: 0,
//       hue: 0,
//       rgb: [0, 0, 0],
//     };
//   }

//   setValue({ target: { value } }) {
//     // const hue = Slider.calculateHue(value);
//     this.setState({ value });
//     if (this.props.onChange) this.props.onChange({target: { value: value }});
//   }

//   render() {
//     const { setValue, state, props } = this;
//     const { value } = state;
//     const { showValue } = props;

//     // const [value, setValue] = useState(0);
//     // const updateValue = event => setValue(event.target.value);
//     const spring = useSpring({ value: parseInt(showValue, 10) })

//     // const { } = props;
//     return (
//       <Fragment>
//         <Input type="range" min="0" max="254" step="0.001" value={value} onChange={setValue} />
//         <animated.progress max="254" value={spring.value} />
//       </Fragment>
//     )
//   }
// }

export default ({ value, showValue, onChange }) => {
  const [target, setTarget] = useState(value);
  const updateTarget = event => {
    setTarget(event.target.value);
    onChange(event);
  };
  const { currentValue } = useSpring({ currentValue: showValue })
  // When not being manipulated, target can follow showValue, otherwise follow value
  return (
    <Fragment>
      <Input type="range" min="0" max="254" step="0.001" value={target} onChange={updateTarget} />
      <Progress max="254" value={currentValue} />
    </Fragment>
  );
}

// Slider.calculateHue = value => (( value / 100 ) * 360).toFixed(0);

