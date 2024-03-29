import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import WindowManagerWindow from './WindowManagerWindow';
import config from 'config';

export default registerApp({
  title: 'Window Manager',
  mainView: <WindowManagerWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}windows/windows.svg`
});