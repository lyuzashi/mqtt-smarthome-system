import React from 'react';
import Button from './button';

export default (props) =>
  <Button onClick={() => fetch('/restart-logic', { method: 'POST' })} {...props} />