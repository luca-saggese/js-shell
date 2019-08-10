import React, { Component } from 'react';
import Scrollable from 'components/Scrollable';
import Icon from 'components/Icon';
import { Icon as AntdIcon } from 'antd';
import FileIcon from 'react-file-icon';
import { ContextMenu3, Menu, MenuItem, MenuItemGroup, SubMenu } from 'components/ContextMenu';

export default class IconLayout extends Component {

  _handleClick = (node) => (evt) => {
    const { filesWindow } = this.props;
    console.log(evt.key,node)
    if(evt.key == 'open') {
      filesWindow.open(node);
    }
  }

  render() {
    const { filesWindow, fsNodes } = this.props;

    return (
      <Scrollable>
        {
          fsNodes.map((childNode, idx) => {
            //console.debug('child node', childNode);
            const menu = [];
            if(!childNode.isDir) {
              menu.push(<MenuItem key="1"><a href={filesWindow.getDownloadUrl(childNode)} target="bank">Download</a></MenuItem>);
            }
            menu.push(<MenuItem key="open">Open</MenuItem>);

            return (
              <ContextMenu3
                menuItems={menu}
                style = {{float: 'left'}}
                onClick = {this._handleClick(childNode)}
              >
                <Icon
                  onClick={ (evt) => filesWindow.selectNode(childNode) }
                  onDoubleClick={ (evt) => {filesWindow.open(childNode)} }
                  // onContextMenu={ (evt) => console.warn('TODO: Build new context menu provider') }
                  key={idx}
                  width={160}
                  height={60}
                  style={{
                    margin: 5,
                    backgroundColor: this.props.selectedNodes.indexOf(childNode) > -1 ? 'rgba(78, 131, 177, 0.41)' : null
                  }}
                  title={childNode.path.name}
                >
                  {
                    childNode.isFile &&
                    <FileIcon extension={childNode.path.ext} size={30} />
                  }

                  {
                    childNode.isDir &&
                    <AntdIcon type="folder" style={{fontSize: 30}} />
                  }
                  
                </Icon>
              </ContextMenu3>
            );
          })
        }
      </Scrollable>
    )
  }
}