import React, { Fragment } from "react";
import styled, { css } from 'styled-components';

const Button = styled.button`
  appearance: none;
  border: 2px solid rgb(70,60,70);
  border-radius: 3px;
  display: block;
  padding: 0;
  margin: 0;
  width: 60px;
  height: 56px;
  background: linear-gradient(rgb(80,80,80), rgb(50,50,50));
  box-shadow:
    3px 1px 26px -1px rgba(15,15,15,0.9), 
    inset -3px 5px 16px 1px rgba(50,50,50,0.4),
    inset 0px 20px 1px -5px rgba(30,30,30,0.9),
    inset 0px -2px 6px 0px rgba(0,0,0,0),
    inset 0px 19px 1px -2px rgba(255,255,255,0.08),
    inset -0.7px -3px 1px 2px rgba(255,255,255,0.4);
  transition-property: box-shadow;
  transition-duration: 0.08s;
  :focus {
    outline: none;
  }
  :active {
    transition-duration: 0.01s;
    background: linear-gradient(rgb(50,50,50), rgb(60,60,60));
    box-shadow: 3px 1px 26px -1px rgba(15,15,15,0.9), 
      inset -3px 5px 16px 1px rgba(50,50,50,0.4),
      inset 0px 20px 1px -5px rgba(30,30,30,0.9),
      inset 0px -2px 6px 3px rgba(0,0,0,0.7),
      inset 0px 20px 1px -2px rgba(255,255,255,0.1),
      inset 0px 0px 1px 3px rgba(200,200,200,0.3);
  }
`;

const Indicator = styled.div`
  width: 10px;
  height: 10px;
  display: block;
  background: linear-gradient(rgb(40,200,40), rgb(40,100,40));
  box-shadow: inset -0.2px -0.2px 3px rgba(0,0,0,0.3),
    0px 0px 0px 00px rgba(255,255,255,0),
    0px 0px 0px 0px rgba(80,255,80,0);
  border-radius: 10px;
  position: absolute;
  transition-property: box-shadow;
  transition-duration: 0.0s;
  ${props => props.on && css`
    background: linear-gradient(rgb(60,255,60), rgb(60,200,60));
    box-shadow: inset -0.2px -0.2px 2px rgba(0,0,0,0.3),
      0px 0px 3px 0.2px rgba(255,255,255,0.8),
      0px 0px 10px 2px rgba(80,255,80,1);
  `}
`;

const Trigger = ({ on, onClick }) => (
  <Fragment>
  <Indicator on={on}/>
  <Button onClick={onClick} />
  </Fragment>
);

export default Trigger;
