import React from 'react';
import createApp from 'utils/desktop/createApp';
import AppBlueprintBaseWindow from './AppBlueprintBaseWindow';
import config from 'config';

export default createApp({
  title: 'SourceCode',
  mainWindow: <AppBlueprintBaseWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}blueprint/blueprint.svg`
});