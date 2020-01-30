import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import ObserveSize from 'react-observe-size';
import styled from 'styled-components';
import fs from '../webdav-fs';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

self.MonacoEnvironment = {
  getWorkerUrl() { return '/vs/base/worker/workerMain.js'; }
};

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      loadedFile: null,
    }
  }
  editorDidMount(editor, monaco) {
    // editor.focus();
  }
  onChange(code) {
    this.setState({ code });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.path !== this.props.path ||
      nextState.loadedFile !== this.props.loadedFile ||
      nextState.code !== this.state.code;
  }

  componentDidUpdate() {
    const { loadedFile } = this.state;
    const { path } = this.props;
    if (loadedFile === null) {
      if (path === null) return this.setState({ code: '', loadedFile: path });
      fs.readFileAwait(path).then(code =>
        this.setState({ code, loadedFile: path })
      )
    }
  }

  save() {
    const { loadedFile, code } = this.state;
    if (!loadedFile) return;
    return fs.writeFileAwait(loadedFile, code);
  }

  render() {
    const { code, language } = this.state;
    const options = {};
    return (
      <Wrapper>
        <ObserveSize>
          {({ width, height }) => 
            <Wrapper>
              <MonacoEditor
                width={width}
                height={height}
                language={language}
                theme="vs-dark"
                value={code}
                options={options}
                onChange={(...args) => this.onChange(...args)}
                editorDidMount={(...args) => this.editorDidMount(...args)}
              />
            </Wrapper>
          }
        </ObserveSize>
      </Wrapper>
    );
  }
}

Editor.defaultProps = {
  loadedFile: null,
};

Editor.getDerivedStateFromProps = (props, state) => { 
  if (props.path !== state.loadedFile) {
    return {
      loadedFile: null,
    }
  }
  return null;
};
