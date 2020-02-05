import React, { Fragment, Component } from 'react';
import { join, basename } from 'path';
import styled, { css } from 'styled-components';
import fs from '../../../system/common/webdav-fs';

const Tree = styled.div`
  ${props => props.root && css`
    display: block;
    position: relative;
    flex-direction: row;
    overflow: auto;
    width: 100%;
    height: 100%;
  `}
  ${props => props.isDir && css`
    margin-left: 1em;
  `}
`;

const Item = styled.div`
  :before {
    ${props => props.isDir && css`
      content: '▹';
    `}
    ${props => props.isFile && css`
      content: '⎘';
    `}
    ${props => props.open && css`
      transform: rotate(45deg);
    `}
    transition-duration: 0.05s;
    transition-property: transform;
    position: absolute;
    margin-left: -0.8em;
  }
  cursor: pointer;
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  font-size: 0.8em;
  line-height: 1.5em;
  color: #ccc;
  ${props => props.isFile && css`
    :active {
      color: #566786;
    }
  `}
  ${props => props.loading && css`
    opacity: 0.5;
  `}
`;

export default class FileBrowser extends Component {

  constructor() {
    super(...arguments);
    const { path, root } = this.props;
    this.nodes = {};
    this.state = {
      name: basename(path),
      loading: true,
      open: root,
      isDir: false,
      isFile: false,
      itemsLoaded: false,
      items: [],
    }
  }

  componentDidMount() {
    const { path } = this.props;
    return fs.statAwait(path).then(stat => {
      const { name } = stat;
      const isDir = stat.isDirectory();
      const isFile = stat.isFile();
      this.setState({ isDir, isFile, name, loading: false });
    })
  }

  componentDidUpdate() {
    const { path, filter } = this.props;
    const { open, isDir, itemsLoaded } = this.state;
    if (open && isDir && !itemsLoaded) {
      return fs.readdirAwait(path).then(items => {
        this.setState({
          items: items.filter(item => !item.match(filter)),
          itemsLoaded: true,
          loading: false,
        });
      })
    } else {
      return Promise.resolve();
    }
  }

  refresh() {
    this.setState({ loading: true, itemsLoaded: false });
    Promise.all([
      this.componentDidMount(),
      this.componentDidUpdate()
    ]).then(() => {
      Object.values(this.nodes).forEach(node => node && node.refresh());
    });
  }

  toggle() {
    const { isFile, isDir, open, itemsLoaded } = this.state;
    const { onClick, path } = this.props;
    if (isFile && onClick) onClick(path);
    if (!isDir) return;
    if (!open && !itemsLoaded) this.setState({ loading: true });
    this.setState({ open: !open });
  }

  render() {
    const { root, onClick } = this.props;
    const { name, items, open, isDir, isFile, loading } = this.state;
    return (
      <Tree root={root}>
        {!root && name &&
          <Item
            onClick={() => this.toggle()}
            isDir={isDir}
            isFile={isFile}
            open={open}
            loading={loading}
          >
            {name}
          </Item>
        }
        {open &&
          <Tree isDir={isDir}>
            {items.map(item =>
              <FileBrowser
                key={item}
                path={join(this.props.path, item)}
                root={false}
                onClick={onClick}
                ref={node => this.nodes[item] = node}
              >
                {item}
              </FileBrowser>
            )}
          </Tree>
        }
      </Tree>
    )
  }
}

FileBrowser.defaultProps = {
  filter: /^\./,
  path: '.',
  root: true,
}