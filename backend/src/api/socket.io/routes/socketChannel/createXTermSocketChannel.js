// @see https://gist.github.com/steinwaywhw/9920493

const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
const { SocketChannel } = require('utils/socketAPI/SocketChannel');
const os = require('os');
const pty = require('node-pty');
// const terminal = require('term.js');
const fs = require('fs');

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const createXTermSocketChannel = async (options = {}, ack) => {
  return handleSocketAPIRoute(() => {
    const { socket } = options;

    const socketChannel = new SocketChannel(socket);
    const socketChannelID = socketChannel.getChannelID();

    // create shell process
    var ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env
    });

    ptyProcess.on('data', (data) => {
      socketChannel.write(socketChannel.str2ab(data));
    });

    socketChannel.on('data', (data) => {
      ptyProcess.write(socketChannel.ab2str(data));
    });

    socketChannel.on('disconnect', () => {
      ptyProcess.kill();
    });

    // console.log('socketChannelID', socketChannelID);

    // ptyProcess.write('ls\r');
    // ptyProcess.resize(100, 40);
    // ptyProcess.write('ls\r');

    return {
      socketChannelID
    };

    // return new Date();
  }, ack);
};

module.exports = createXTermSocketChannel;