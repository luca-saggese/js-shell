import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import { Input } from 'antd';
import Center from 'components/Center';
import IFrame from 'components/IFrame';
import config from 'config';

const HOST_PROXY = ''//'http://localhost:3002/proxy/'

const Address = Input;

export default class WebrowserWindow extends Component {
  state = {
    url: 'about:blank',
    newUrl :'http://www.google.com'
  }

  _handleOnLoad(component, iframe, evt) {
    
    this._iframeWindow = iframe.contentWindow;
    this._iframeWindow.onloadstart = (e)=> console.log('load start', e , this._iframeWindow.location)
    this._iframeWindow.onerror = (e)=> console.log('error', e , this._iframeWindow.location)

    console.log('_handleOnLoad', component, iframe, evt, this._iframeWindow.location)
  }

  _handelOnChange(evt) {
    this.setState({newUrl: evt.target.value});
  }

  _handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.setState({url: this.state.newUrl});
    }
  }

  render() {
    const { ...propsRest } = this.props;
    const { url, newUrl } = this.state;
    return (
      <Window
        {...propsRest}
        toolbar={
          <Address
            onChange={this._handelOnChange.bind(this)}
            onKeyDown={this._handleKeyDown.bind(this)}
            value={newUrl}
            size="small"
            placeholder="Type url"
            style={{ minWidth: '220px' }}
          />
        }
      >
        <IFrame
          style={{width: '100%', height:'100', backgroundColor:'#fff'}}
          onLoad={this._handleOnLoad.bind(this)}
          
          src={`${HOST_PROXY}${url}`}
        />
        {
          /*

          srcdoc="<html><body><h1>test</h1></body></html>"



          <Center style={{backgroundColor: 'rgba(255,255,255,.8)'}}>
            <Image width="100%" height="100%" src={`${config.HOST_ICON_URI_PREFIX}brands/zenOSmosis-logo.svg`} />
          </Center>
          */
        }
      </Window>
    );
  }
}
