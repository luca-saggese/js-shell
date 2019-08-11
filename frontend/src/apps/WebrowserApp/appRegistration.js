import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import WebrowserWindow from './WebrowserWindow';
import config from 'config';

export default registerApp({
  title: 'Web Browser',
  mainView: (props) => {
    return (
      <WebrowserWindow {...props} />
    )
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}hello/hello.svg`
});