import React, { Component } from 'react';
import PanelGroup from 'react-panelgroup';
import Stack from './stack';
import Bar from './bar';
import Button from './button';
import FileBrowser from './file-browser';
import Editor from './editor';

export default class Config extends Component {

  constructor() {
    super();
    this.state = {
      path: null,
    };
  }

  open(path) {
    this.setState({ path });
  }

  render() {
    const { path } = this.state;
    return (
      <Stack>
        <Bar>
          {path}
          <Button onClick={() => this.editor.save()}>💾</Button>
        </Bar>
        <PanelGroup
          direction="row"
          borderColor="grey"
          panelWidths={[{ size: 300 }]}
        >
          <FileBrowser onClick={(...args) => this.open(...args)}/>
          <Editor path={path} ref={editor => this.editor = editor}/>
        </PanelGroup>
      </Stack>
    );
  }
}