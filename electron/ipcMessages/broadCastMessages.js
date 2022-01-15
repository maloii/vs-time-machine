const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createBroadCastWindow() {
    const screenWindow = new BrowserWindow({
        width: 1024,
        height: 1024,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js'),
            contextIsolation: true
        },
        icon: path.join(__dirname, 'AppIcon.icns')
    });
    global.windows['screen'] = screenWindow;
    screenWindow.loadURL(
        isDev
            ? 'http://localhost:3000/screen/current-group'
            : `file://${path.join(__dirname, '../../build/index.html#/screen/current-group')}`
    );
    screenWindow.on('closed', () => {
        delete global.windows.screen;
    });
}

ipcMain.on('open-current-group-broadcast-request', async (e) => {
    createBroadCastWindow();
});
