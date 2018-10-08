import React, { Component } from 'react';
import Tree from 'react-ui-tree';

export default class FileBrowser extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      tree: {
        "module": "react-ui-tree",
        "children": [{
          "collapsed": true,
          "module": "dist",
          "children": [{
            "module": "node.js"
          }]
        }]
      }
    }
  }

  renderNode(node) {
    /* 
     className={cx('node', {
          'is-active': node === this.state.active
        })}
        */
    return (
      <span
       
        onClick={this.onClickNode.bind(null, node)}
      >
        {node.module}
      </span>
    );
  };

  onClickNode(node) {
    this.setState({
      active: node
    });
  };

  handleChange(tree) {
    this.setState({
      tree: tree
    });
  };

  updateTree() {
    const { tree } = this.state;
    tree.children.push({ module: 'test' });
    this.setState({
      tree: tree
    });
  };



  render() {
    return (
      <Tree
        paddingLeft={20}              // left padding for children nodes in pixels
        tree={this.state.tree}        // tree object
        onChange={(tree) => this.handleChange(tree)}  // onChange(tree) tree object changed
        renderNode={(node) => this.renderNode(node)}  // renderNode(node) return react element
      />
    );
  }
}