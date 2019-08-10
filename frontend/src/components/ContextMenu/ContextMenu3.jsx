import React, { Component } from 'react';
import { Menu, MenuItem, MenuItemGroup, SubMenu } from 'components/Menu';
import { Icon } from 'antd';
import uuidv4 from 'uuid/v4';
import DesktopLinkedState from 'state/DesktopLinkedState';
import './style.css';
import hocConnect from '../../state/hocConnect';

function parsePx(val) {
  if(!val || val == '') {
    return 0;
  } else {
    return parseInt(val.replace('px',''));
  }
}

function getClickPos(evt, rootElement) {
  let clickX = evt.offsetX
  let clickY = evt.offsetY;
  let element = evt.target;
  while (element != rootElement) {
    if(element.style){
      clickX += parsePx(element.style.marginLeft) + parsePx(element.style.paddingLeft);
      clickY += parsePx(element.style.marginTop) + parsePx(element.style.paddingTop);
    }
    element = element.parentElement
  }

  return {clickX, clickY}
}

class ContextMenu extends Component {
  state ={
    menuVisible: false,
  }

  componentDidMount() {
    this._root.addEventListener('contextmenu', this._handleContextMenu.bind(this));
    document.addEventListener('mousedown', this._handleDocClick.bind(this));
    this._root.addEventListener('scroll', this._handleDocScroll.bind(this));
  };

  componentWillUnmount() {
    this._root.removeEventListener('contextmenu', this._handleContextMenu);
    document.removeEventListener('mousedown', this._handleDocClick);
    this._root.removeEventListener('scroll', this._handleDocScroll);
  }

  _handleContextMenu = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    this.setState({ menuVisible: true });

    //const clickX = evt.offsetX + 5;
    //const clickY = evt.offsetY - this._root.offsetHeight + 5;

    let { clickX, clickY } = getClickPos(evt, this._root);
    clickY -= this._root.offsetHeight;


    console.log(clickX, clickY, this._root)

    const screenW = this._root.parentElement.offsetWidth;
    const screenH = this._root.parentElement.offsetHeight;
    const rootW = this._overlay.offsetWidth;
    const rootH = this._overlay.offsetHeight;

    const right = (clickX + rootW + this._root.offsetLeft) < screenW;
    const left = !right;
    const top = (clickY + rootH + this._root.offsetTop + this._root.offsetHeight) < screenH;
    const bottom = !top;

    
    if (right && bottom) {
      this._overlay.style.left = `${clickX + 5}px`;
      this._overlay.style.top = `${clickY - rootH - 5}px`;
      this._overlay.style.borderBottomLeftRadius = 0;
    }

    if (right && top) {
      this._overlay.style.left = `${clickX + 5}px`;
      this._overlay.style.top = `${clickY + 5}px`;
      this._overlay.style.borderTopLeftRadius = 0;
    }

    if (left && top) {
      this._overlay.style.left = `${clickX - rootW - 5}px`;
      this._overlay.style.top = `${clickY + 5}px`;
      this._overlay.style.borderTopRightRadius = 0;
    }

    if (left && bottom) {
      this._overlay.style.left = `${clickX - rootW - 5}px`;
      this._overlay.style.top = `${clickY - rootH + 5}px`;
      this._overlay.style.borderBottomRightRadius = 0;
    }
  

   
  };

  _handleDocClick = (evt) => {
    if(this._overlay) {
      const { menuVisible } = this.state;
      const wasOutside = !(this._overlay.contains(evt.target));
      if (wasOutside && menuVisible) this.setState({ menuVisible: false, });
    }
  };

  _handleDocScroll = () => {
    const { menuVisible } = this.state;
    if (menuVisible) this.setState({ menuVisible: false, });
  };

  _handleClick = (e) => {
    const { onClick } = this.props;
    const { menuVisible } = this.state;
    if(typeof onClick != 'undefined'){
      onClick(e);
    }
    if (menuVisible) this.setState({ menuVisible: false, });
  }

  render() {
    const { menuVisible } = this.state;
    const { children, menuItems, ...propsRest } = this.props;
    
    return (
      <div
        ref={ c => this._root = c }
        {...propsRest}
      >
        {
          children
        }
        {
          menuVisible &&
          <div style={{position:'absolute'}}>
          <div 
            ref={ref => { this._overlay = ref }} 
            className="zd-context-menu-overlay2 " 
          >
            <Menu
                onClick={evt => this._handleClick(evt)}
                // style={{ width: 256 }}
                mode="vertical"
            >
              {
                menuItems
              }
            </Menu>
          </div>
          </div>
        }
      </div>
    );
  };
}

export default hocConnect(ContextMenu, DesktopLinkedState, (updatedState) => {
  const {contextMenuIsTrapping: isTrapping} = updatedState;

  let filteredState = {};

  if (typeof isTrapping !== 'undefined') {
    filteredState = {
      isTrapping
    };
  }
  
  if (filteredState) {
    return filteredState;
  }
});