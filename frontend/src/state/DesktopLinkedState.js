import config from '../config';
import hocConnect from './hocConnect';
import LinkedState, {EVT_LINKED_STATE_UPDATE} from './LinkedState';
import uuidv4 from 'uuid/v4';

export {
  EVT_LINKED_STATE_UPDATE,
  hocConnect
};

const DESKTOP_LINKED_SCOPE_NAME = `desktop-linked-state-${uuidv4()}`;

export default class DesktopLinkedState extends LinkedState {
  constructor() {
    super(DESKTOP_LINKED_SCOPE_NAME, {
      contextMenuIsTrapping: config.DESKTOP_CONTEXT_MENU_IS_TRAPPING,
      lastNotification: {
        message: null,
        description: null,
        onClick: null
      },

      // A list of running apps
      launchedAppConfigs: [],

      backgroundURI: config.DESKTOP_DEFAULT_BACKGROUND_URI
    });
  }

  registerLaunchedAppConfig(appConfig) {
    const {launchedAppConfigs} = this.getState();

    launchedAppConfigs.push(appConfig);

    this.setState({
      launchedAppConfigs
    });
  }

  launchAppConfig(appConfig) {
    this.setState({
      lastLaunchAppConfig: appConfig
    });
  }

  setBackgroundURI(backgroundURI) {
    this.setState({
      backgroundURI
    });
  }

  /**
   * Sets whether or not the desktop should trap the right-click context menu.
   * 
   * @param {boolean} contextMenuIsTrapping 
   */
  setContextMenuIsTrapping(contextMenuIsTrapping) {
    this.setState({
      contextMenuIsTrapping
    });
  }

  getContextMenuIsTrapping() {
    const {contextMenuIsTrapping} = this.getState();

    return contextMenuIsTrapping;
  }
}

const commonDesktopLinkedState = new DesktopLinkedState();
export {
  commonDesktopLinkedState
};
