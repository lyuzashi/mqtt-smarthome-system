import React, { Component } from 'react';
import floorplan from './floorplan.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <svg viewBox="0 0 841.9 595.3" xmlns="http://www.w3.org/2000/svg">
            <use href={`${floorplan}#floorplan`} />
          </svg>
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
