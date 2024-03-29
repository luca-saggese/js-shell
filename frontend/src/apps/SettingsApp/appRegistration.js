import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import SettingsWindow from './SettingsWindow';
import config from 'config';

export default registerApp({
  title: 'Settings',
  mainView: (props) => {
    return (
      <SettingsWindow {...props} />
    )
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}settings/settings.svg`
});
