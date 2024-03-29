/**
 * API routing for the client Socket.io connection.
 */

const echo = require('./echo');
const { createXTermSocketChannel } = require('./socketChannel');
const p2p = require('./p2p');
const env = require('./env');
const ping = require('./ping');
const fileSystem = require('./fileSystem');
const systemTime = require('./systemTime');
const debugError = require('./debugError');
const xApps = require('./xApps');
const appCategories = require('./appCategories');
// const systemCommand = require('./systemCommand');
// const portAudio = require('./portAudio');
const wallpapers = require('./wallpapers');
// const {fetchSystemInformation, fetchSystemInformationModes} = require('./systemInformation');
const routes = require('./routes');

const {
  SOCKET_API_ROUTE_ECHO,
  SOCKET_API_ROUTE_ENV,
  SOCKET_API_ROUTE_DEBUG_ERROR,
  SOCKET_API_ROUTE_PING,
  SOCKET_API_ROUTE_FILESYSTEM,
  SOCKET_API_ROUTE_FETCH_SYSTEM_TIME,
  SOCKET_API_ROUTE_FETCH_X_APPS,
  SOCKET_API_ROUTE_FETCH_X_APP_CATEGORIES,
  // SOCKET_API_ROUTE_SYSTEM_COMMAND,
  // SOCKET_API_ROUTE_FETCH_SYS_INFO,
  // SOCKET_API_ROUTE_FETCH_SYS_INFO_MODES,
  // SOCKET_API_ROUTE_PORT_AUDIO_FETCH_DEVICES,
  // SOCKET_API_ROUTE_PORT_AUDIO_FETCH_HOST_APIS,
  SOCKET_API_ROUTE_WALLPAPERS_FETCH_WALLPAPER_PATHS,

  // P2P
  SOCKET_API_ROUTE_FETCH_SOCKET_IDS,
  SOCKET_API_ROUTE_SEND_SOCKET_PEER_DATA,

  // Socket channels
  SOCKET_API_ROUTE_CREATE_XTERM_SOCKET_CHANNEL,

  SOCKET_API_ROUTE_REQUEST_DISCONNECT
} = routes;

/**
 * Initializes socket.io routes for the given socket connection.
 * 
 * TODO: Adjust socket param type to reflect actual type (instead of generic
 * object).
 * 
 * @param {object} socket A socket.io socket.
 */
const initSocket = (socket) => {
  console.log(`Initializing Socket.io routes for socket with id: ${socket.id}`);

  socket.on(SOCKET_API_ROUTE_ECHO, echo);
  socket.on(SOCKET_API_ROUTE_ENV, env);
  socket.on(SOCKET_API_ROUTE_DEBUG_ERROR, debugError);
  socket.on(SOCKET_API_ROUTE_PING, ping);
  socket.on(SOCKET_API_ROUTE_FILESYSTEM, fileSystem);
  
  socket.on(SOCKET_API_ROUTE_FETCH_SYSTEM_TIME, systemTime);
  socket.on(SOCKET_API_ROUTE_FETCH_X_APPS, xApps);
  socket.on(SOCKET_API_ROUTE_FETCH_X_APP_CATEGORIES, appCategories);

  socket.on(SOCKET_API_ROUTE_WALLPAPERS_FETCH_WALLPAPER_PATHS, wallpapers.fetchWallpaperPaths);

  // P2P
  socket.on(SOCKET_API_ROUTE_FETCH_SOCKET_IDS, p2p.fetchSocketIDs);
  socket.on(SOCKET_API_ROUTE_SEND_SOCKET_PEER_DATA, p2p.sendSocketPeerData);

  // Socket channel
  socket.on(SOCKET_API_ROUTE_CREATE_XTERM_SOCKET_CHANNEL, (options, ack) => {
    options = Object.assign(options || {}, {
      socket
    });

    // Subsequent communications over this socket route handled internally via
    // SocketChannel
    createXTermSocketChannel(options, ack);
  });

  // Handle client disconnect request
  socket.on(SOCKET_API_ROUTE_REQUEST_DISCONNECT, () => {
    socket.disconnect();
  });

  // socket.on(SOCKET_API_ROUTE_SYSTEM_COMMAND, systemCommand); // TODO: Convert
  // socket.on(SOCKET_API_ROUTE_FETCH_SYS_INFO, fetchSystemInformation);  // TODO: Convert
  // socket.on(SOCKET_API_ROUTE_FETCH_SYS_INFO_MODES, fetchSystemInformationModes);  // TODO: Convert

  // socket.on(SOCKET_API_ROUTE_PORT_AUDIO_FETCH_DEVICES, portAudio.fetchDevices);  // TODO: Convert
  // socket.on(SOCKET_API_ROUTE_PORT_AUDIO_FETCH_HOST_APIS, portAudio.fetchHostAPIs);  // TODO: Convert

  console.log(`Initialized Socket.io routes for socket with id: ${socket.id}`);
};

module.exports = {
  initSocket
};