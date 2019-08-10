import React, { Component } from 'react';
import { Menu, MenuItem, MenuItemGroup, SubMenu } from 'components/Menu';
import { Icon } from 'antd';
import uuidv4 from 'uuid/v4';
import DesktopLinkedState from 'state/DesktopLinkedState';
import './style.css';
import hocConnect from '../../state/hocConnect';

class ContextMenu extends Component {
  state = {
    isVisible: false
  };

  _uuidv4 = null;

  constructor(props) {
    super(props);

    this._uuidv4 = uuidv4();
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
    let {isTrapping} = this.props;
    isTrapping = (typeof isTrapping === 'undefined' ? true : isTrapping);

    if (!isTrapping) {
      return;
    }

    // TODO: Remove
    console.debug('context menu uuidv4', this._uuidv4);

    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ isVisible: true });

    // TODO: Fix overlay positioning for moved windows, etc.
    // Issue is that overlays draw way off when presented on window moved far
    // east or south

    const clickX = evt.clientX;
    const clickY = evt.clientY;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const rootW = this._overlay.offsetWidth;
    const rootH = this._overlay.offsetHeight;

    const right = (screenW - clickX) > rootW;
    const left = !right;
    const top = (screenH - clickY) > rootH;
    const bottom = !top;

    if (right) {
      this._overlay.style.left = `${clickX + 5}px`;
    }

    if (left) {
      this._overlay.style.left = `${clickX - rootW - 5}px`;
    }

    if (top) {
      this._overlay.style.top = `${clickY + 5}px`;
    }

    if (bottom) {
      this._overlay.style.top = `${clickY - rootH - 5}px`;
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
    const { isVisible } = this.state;

    if (isVisible) this.setState({ isVisible: false, });
  };

  _handleClick = (e) => {
    console.debug('click', e);
  }

  render() {
    const {
        children,
        isTrapping,
        className,
        menuItems,
        ...propsRest
    } = this.props;
    
    const { isVisible } = this.state;

    return (
      <div
        {...propsRest}
        ref={ c => this._root = c }
        className={`zd-context-menu ${className ? className : ''}`}
      >
        {
          children
        }
        {
          isVisible &&
          <div ref={ref => { this._overlay = ref }} className="zd-context-menu-overlay">
            <Menu
                onClick={this._handleClick}
                mode="vertical"
            >
            {
              menuItems
            }
            </Menu>
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