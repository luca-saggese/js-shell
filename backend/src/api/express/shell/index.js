//TODO: either use socket io 
// https://github.com/xtermjs/xterm.js/issues/1972
// or get it working with current express implementation (see expressServer.js server.listen(HTTP_LISTEN_PORT, () => {)


const pty = require('node-pty');

module.exports = expressShell;

function expressShell(app2) {
  /*this._expressWs = require('express-ws')(app);

  // Instantiate shell and set up data handlers
  this._expressWs.app.ws('/shell', (ws, req) => {
    console.log('------ shell connect')
    // Spawn the shell
    const shell = pty.spawn('/bin/bash', [], {
      name: 'xterm-color',
      cwd: process.env.PWD,
      env: process.env
    });
    // For all shell data send it to the websocket
    shell.on('data', (data) => {
      ws.send(data);
    });
    // For all websocket data send it to the shell
    ws.on('message', (msg) => {
      shell.write(msg);
    });
  });*/
  const express = require('express');
 

  const app = express();
  const expressWs = require('express-ws')(app);

  const Unblocker = require('unblocker');

  // run unblocker for proxify webbrowser
  app.use(new Unblocker({prefix: '/proxy/'}));

  // Serve static assets from ./static
  app.use(express.static(`${__dirname}/static`));

  // Instantiate shell and set up data handlers
  expressWs.app.ws('/shell', (ws, req) => {
    // Spawn the shell
    const shell = pty.spawn('/bin/bash', [], {
      name: 'xterm-color',
      cwd: process.env.HOME,
      env: process.env
    });
    // For all shell data send it to the websocket
    shell.on('data', (data) => {
      ws.send(data);
    });
    // For all websocket data send it to the shell
    ws.on('message', (msg) => {
      shell.write(msg);
    });
  });

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  // Start the application
  app.listen(3002);
}








