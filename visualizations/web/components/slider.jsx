import React, { useState, useRef, Fragment } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring'

// Use CSS vars for better performance
const Input = styled(animated.input)`
  width: 240px;
  position: relative;
  z-index: 1;
  appearance: none;
  border-radius: 0.5em;
  background-color: rgba(0,0,0,0.1);
  height: 0.5em;
  margin:1.5em 0;
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

export default ({ value = 0, onChange, min, max }) => {
  const [target, setTarget] = useState(value);
  const [editing, setEditing] = useState(false);
  const input = useRef();
  const { displayValue } = useSpring({
    displayValue: editing ? parseInt(target, 10): value,
    onFrame({ displayValue: forceValue }) { if (!editing) input.current.value = forceValue }
  });
  const updateTarget = event => {
    setTarget(event.target.value);
    onChange(event);
  };
  // Time delay to allow device to respond before updating current value. This prevents visual jumping.
  // Could the spring avoid switching to value until a new value is received?
  const ping = 400;
  return (
    <Input
      type="range"
      min={min}
      max={max}
      value={editing ? target : displayValue}
      onChange={updateTarget}
      ref={input}
      style={{ color: displayValue.interpolate(v => `hsl(${(v - min) * 360 / (max - min)}, 100%, 50%)` )}}
      onMouseDown={() => setEditing(true)}
      onMouseUp={() => {console.log(target); setTimeout(() => setEditing(false), ping)}}
    />
  );
}
