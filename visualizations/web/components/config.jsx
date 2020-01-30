import React, { Component } from 'react';
import PanelGroup from 'react-panelgroup';
import Stack from './stack';
import Bar from './bar';
import Button from './button';
import ExpandHorizontal from './expand-horizontal';
import RestartLogicButton from './restart-logic-button';
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
          <ExpandHorizontal>
            {path}
          </ExpandHorizontal>
          <Button onClick={() => this.editor.save()} title="Save current file changes">save</Button>
          <RestartLogicButton title="Restart logic engine">restart</RestartLogicButton>
          <Button onClick={() => this.browser.refresh()} title="Refresh file browser">refresh</Button>
        </Bar>
        <PanelGroup
          direction="row"
          borderColor="grey"
          panelWidths={[{ size: 300 }]}
        >
          <FileBrowser onClick={(...args) => this.open(...args)} ref={browser => this.browser = browser}/>
          <Editor path={path} ref={editor => this.editor = editor}/>
        </PanelGroup>
      </Stack>
    );
  }
}