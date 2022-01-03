const { ipcMain } = require('electron');
const { connector } = require('../Connector');
const Serialport = require('serialport');

ipcMain.on('list-serial-ports-request', async (e) => {
    const list = (await Serialport.list()).map((item) => item.path);
    e.reply('list-serial-ports-response', list);
});

ipcMain.on('connect-serial-port-request', async (e, path) => {
    if (path) {
        connector.connect('SERIAL_PORT', path);
    }
});

ipcMain.on('disconnect-serial-ports-request', async (e) => {
    if (connector && connector.isConnect) {
        connector.disconnect();
    }
    e.reply('status-serial-port', { isOpen: false });
});

ipcMain.on('status-serial-port-request', async (e) => {
    sendStatus(e);
});

const sendStatus = (e) => {
    if (connector && connector.connector && connector.connector.port) {
        e.reply('status-serial-port', { isOpen: connector.connector.port.isOpen, path: connector.connector.port.path });
    } else {
        e.reply('status-serial-port', { isOpen: false });
    }
};
