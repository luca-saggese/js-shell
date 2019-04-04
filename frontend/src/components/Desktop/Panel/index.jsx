import React, {Component} from 'react';
import Desktop from '../Desktop';
import {WindowLifecycleEvents, EVT_WINDOW_DID_ACTIVATE, EVT_WINDOW_TITLE_DID_SET} from './../../../components/Desktop/Window';
import './style.css';

export default class Panel extends Component {
  state = {
    controlUIWindow: null,
    controlUIWindowTitle: null,
  };

  constructor(props) {
    super(props);

    if (!(this.props.desktop instanceof Desktop)) {
      throw new Error(`'desktop' property must be passed and must be an instance of Desktop`);
    }

    this._masterLifecycleEvents = (() => {
      const masterLifecycleEvents = new WindowLifecycleEvents();
      masterLifecycleEvents.on(EVT_WINDOW_DID_ACTIVATE, (controlUIWindow) => {
        const controlUIWindowTitle = controlUIWindow.state.title;
  
        this.setState({
          controlUIWindow,
          controlUIWindowTitle
        });
      });
      masterLifecycleEvents.on(EVT_WINDOW_TITLE_DID_SET, (controlUIWindow) => {
        const controlUIWindowTitle = controlUIWindow.state.title;
  
        this.setState({
          controlUIWindowTitle
        });
      });

      return masterLifecycleEvents;
    })();


  }

  render() {
    const {desktop, children, className, ...propsRest} = this.props;

    return (
      <div
        {...propsRest}
        className={`DesktopPanel Horizontal ${className ? className : ''}`}
      >
        <div className="DesktopPanelColumnLeft">
          {
            this.state.controlUIWindow &&
            this.state.controlUIWindowTitle
          }
        </div>

        <div className="DesktopPanelColumnCenter">
          <button onClick={evt => desktop.createWindow()}>+</button>
          <button onClick={evt => desktop.createSystemInformationWindow()}>View System Information</button>
        </div>

        <div className="DesktopPanelColumnRight">
          [right]
        </div>
      </div>
    );
  }
}