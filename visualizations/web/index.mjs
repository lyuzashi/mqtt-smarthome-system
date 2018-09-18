import WebDavFS from 'webdav-fs';
import path from 'path';
import App from './app';
import React from 'react';
import ReactDOM from 'react-dom';


ReactDOM.render(React.createElement(App, {toWhat: 'World'}, null), window.app);

console.log(WebDavFS, path, app);