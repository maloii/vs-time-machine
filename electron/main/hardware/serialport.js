const { ipcMain } = require('electron');
const SerialPort = require('serialport');

let connector;
ipcMain.on('list-serial-ports-request', async (e) => {
    const list = (await SerialPort.list()).map((item) => item.path);
    e.reply('list-serial-ports-response', list);
});

ipcMain.on('connect-serial-port-request', async (e, path) => {
    if (path) {
        connector = new SerialPort(path, { baudRate: 115200 });
        connector.on('data', (data) => {
            // e.reply('connector-message', data.toString());
            if (global.mainWindow) {
                global.mainWindow.webContents.send('connector-message', data.toString());
            }
            // parseMessage(data.toString());
        });
    }
});

ipcMain.on('disconnect-serial-ports-request', async (e) => {
    if (connector && connector.isOpen) {
        connector.close();
    }
    e.reply('status-serial-port', { isOpen: false });
});

ipcMain.on('status-serial-port-request', async (e) => {
    sendStatus(e);
});

const sendStatus = (e) => {
    if (connector) {
        e.reply('status-serial-port', { isOpen: connector.isOpen, path: connector.path });
    } else {
        e.reply('status-serial-port', { isOpen: false });
    }
};
