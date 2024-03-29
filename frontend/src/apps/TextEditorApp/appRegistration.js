import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import TextEditorWindow from './TextEditorWindow';
import config from 'config';

export default registerApp({
  title: 'Text Editor',
  mainView: (props) => {
    return (
      <TextEditorWindow {...props} />
    )
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}text/text.svg`
});