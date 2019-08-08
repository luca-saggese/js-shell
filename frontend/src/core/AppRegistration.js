import EventEmitter from 'events';
import AppRuntime from './AppRuntime';
import AppRegistryLinkedState from 'state/AppRegistryLinkedState';
import DesktopLinkedState from 'state/DesktopLinkedState';
import { EVT_EXIT } from 'process/ClientProcess';
import './AppRuntime.typedef';

const commonDesktopLinkedState = new DesktopLinkedState();
const commonAppRegistryLinkedState = new AppRegistryLinkedState();
let _createdWindowsCount = 0;






/**
 * Creates a registration which automatically populates app menus and the Dock
 * (if apps are launched, or they're pinned).
 * 
 * TODO: Move this comment to the Dock; The items in the Dock represent a
 * filtered subset of all available registrations.
 * 
 * In order to populate the Dock, and any relevant app menus, this class should
 * be instantiated for each referenced app.
 * 
 * @extends EventEmitter
 */
class AppRegistration extends EventEmitter {
  /**
   * 
   * @param {AppRuntimeRunProps} runProps 
   */
  constructor(runProps) {
    super();

    const {
      title,
      iconSrc,
      mainView,
      cmd: appCmd,
      supportedMimes,
      menuItems,
      allowMultipleWindows,
    } = runProps;

    this._isLaunched = false;
    this._appRuntimes = [];

    this._title = title;
    this._iconSrc = iconSrc;
    this._mainView = mainView;
    this._appCmd = appCmd;

    // TODO: Handle accordingly
    this._menuItems = menuItems || [];

    // Previous position and size
    this._lastPosition = { x: 0, y: 0 };
    this._lastSize = { width: 0, height: 0 };

    this._isUnregistered = false;
    this._supportedMimes = supportedMimes || [];

    this._allowMultipleWindows = allowMultipleWindows;

    // Add this app registration to the registry
    commonAppRegistryLinkedState.addAppRegistration(this);
  }

  /**
   * TODO: Document
   */
  async launchApp(cmdArguments = null) {
    try {
      if (this._appRuntimes.length && !this._allowMultipleWindows) {
        // Gracefully fail
        console.warn('App is already launched, or is launching');
        return;
      }

      // Set positioning
      // TODO: Fix https://github.com/zenOSmosis/js-shell/issues/11
      if (this._lastPosition.x === 0 && this._lastPosition.y === 0) {
        this._lastPosition = { x: _createdWindowsCount * 20, y: _createdWindowsCount * 20 }
      }
      ++_createdWindowsCount;

      const appRuntime = new AppRuntime({
        title: this._title,
        iconSrc: this._iconSrc,
        mainView: this._mainView,
        appCmd: this._appCmd,
        position: this._lastPosition,
        size: this._lastSize,
        menuItems: this._menuItems,
        cmdArguments
      });

      // Handle cleanup when the app exits
      appRuntime.on(EVT_EXIT, () => {
        // Retain position and size for next open
        this._lastPosition = appRuntime.getInitPosition();
        this._lastSize = appRuntime.getInitSize();

        this._isLaunched = false;

        // Remove this appRuntime instance
        this._appRuntimes = this._appRuntimes.filter(a => {
          return !Object.is(a, appRuntime);
        });

        if (!this._appRuntimes.length) {
          // Emit to listeners that the app is closed
          commonAppRegistryLinkedState.emitRegistrationsUpdate();
        }
      });

      await appRuntime.onceReady();

      this._appRuntimes.push(appRuntime);

      this._isLaunched = true;

      // Emit to listeners that the app is launched
      commonAppRegistryLinkedState.emitRegistrationsUpdate();
    } catch (exc) {
      throw exc;
    }
  }

  getIsLaunched() {
    return this._isLaunched;
  }

  /**
   * @return {boolean} Whether multiple instances of this View (or Window) are
   * allowed.
   */
  getAllowMultipleWindows() {
    return this._allowMultipleWindows;
  }

  /**
   * Retrieves the launched app's process runtimes, if available.
   * 
   * @return {AppRuntime[]00}
   */
  getAppRuntimes() {
    return this._appRuntimes;
  }

  /**
   * TODO: Document
   */
  getSupportedMimes() {
    return this._supportedMimes;
  }

  /**
   * @return {Promise<void>}
   */
  async closeApp() {
    try {
      const lenAppRuntimes = this._appRuntimes.length;

      if (!lenAppRuntimes) {
        // Gracefully fail
        console.warn('appRuntime is not registered');
        return;
      }

      for (let i = 0; i < lenAppRuntimes; i++) {
        let appRuntime = this._appRuntimes[i];
        await appRuntime.close();
      }

    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @return {string}
   */
  getTitle() {
    return this._title;
  }

  /**
   * Focuses all related AppRuntime instances.
   */
  focus() {
    //focus respecting order
    const apps = commonDesktopLinkedState.getAppRuntimeFocusOrder().filter(a => (this._appRuntime.indexOf(a)>-1))
    apps.forEach(a=> a.focus());
  }

  getIconSrc() {
    return this._iconSrc;
  }

  // TODO: Rename
  getMainWindow() {
    return this._mainView;
  }

  /**
   * Removes this app from the Desktop registry.
   * 
   * Important!  Once the app is unregistered, it is no longer available in the
   * Dock or any app menus.
   */
  async unregister() {
    try {
      if (this.getIsLaunched()) {
        const appRuntimes = this.getAppRuntimes();

        for (let i = 0; i < appRuntimes.length; i++) {
          let appRuntime = appRuntimes[i];
          await appRuntime.kill();
        }
      }

      // Remove from LinkedState
      commonAppRegistryLinkedState.removeAppRegistration(this);

      this._isUnregistered = true;
    } catch (exc) {
      throw exc;
    }
  }
}

export default AppRegistration;