import Window, { getWindowStack, EVT_RESIZE } from './Window';
// import hocConnect from 'state/hocConnect';
// import AppRegistryLinkedState from 'state/AppRegistryLinkedState';

export default Window;
export {
  getWindowStack,
  EVT_RESIZE
};
/*

const AppRegistryWindow = hocConnect(Window, AppRegistryLinkedState, (updatedState, linkedScope) => {
  const appRegistrations = linkedScope.getAppRegistrations();
  console.debug('window-----updated state', updatedState);

  const { focusedAppRuntime } = updatedState;


  return {
    appRegistrations
  };
});

export default AppRegistryWindow;

*/