import React, { useState, useRef, Fragment } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring'
import { divided_A, divided_B, divided_C, miredRange } from '../../../interfaces/hue/color';

const brightness = [0, 100].map(l => `hsl(0,0%,${l}%)`).join(); // TODO CSS variable of current hue or CT could be used
const spectrum = divided_B.map(([R,G,B]) => `rgb(${R},${G},${B})`).join();

// TODO add these as marks on slider
// Relax = 2237K
// Read = 2890K
// Concentrate = 4291K
// Energize = 6410K

const capabilityGradient = ({ capability, min, max }) => {
  switch (capability) {
    case 'brightness': return brightness;
    case 'hue': return spectrum; // based on light capabilities
    case 'colorTemp': return miredRange([min, max]).map(([R,G,B]) => `rgb(${R},${G},${B})`).join();
  }
}

// Use CSS vars for better performance
const Input = styled(animated.input)`
  width: 240px;
  position: relative;
  z-index: 1;
  appearance: none;
  box-shadow: 0 0 2px rgba(0,0,0,0.3);
  border-radius: 0.5em;
  background-color: rgba(0,0,0,0.1);
  height: 0.5em;
  margin:1.5em 0;
  display: block;
  outline: none;
  transition: color 0.05s linear;
  background: linear-gradient(to right, ${props => props.gradient});
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

export default ({ value = 0, onChange, min, max, capability }) => {
  const [target, setTarget] = useState(value);
  const [editing, setEditing] = useState(false);
  const input = useRef();
  const { displayValue } = useSpring({
    displayValue: editing ? parseInt(target, 10): value,
    onFrame({ displayValue: forceValue }) { if (!editing) input.current.value = forceValue }
  });
  const activeValue = editing ? target : displayValue;
  const updateTarget = event => {
    setTarget(event.target.value);
    onChange(event);
  };
  const gradient = capabilityGradient({ capability, min, max });
  // Time delay to allow device to respond before updating current value. This prevents visual jumping.
  // Could the spring avoid switching to value until a new value is received?
  /*
  Ping needs to wait until new value after editing set to false.
  onMouseUp must publish last target too.
    publishing 162
    device-switch.jsx:62 publishing 160
    device-switch.jsx:62 publishing 159
    slider.jsx:121 159
    device-switch.jsx:62 publishing 254
  */
 // TODO style should use activeValue otherwise it always springs while being manipulated
  const ping = 400;
  return (
    <Input
      type="range"
      min={min}
      max={max}
      value={activeValue}
      onChange={updateTarget}
      ref={input}
      style={{ color: displayValue.interpolate(v => `hsl(${(v - min) * 360 / (max - min)}, 100%, 50%)` )}}
      gradient={gradient}
      onMouseDown={() => setEditing(true)}
      onMouseUp={() => {console.log(target); setTimeout(() => setEditing(false), ping)}}
    />
  );
}
