const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { v4 } = require('uuid');
const {
    broadCastFindAll,
    broadCastInsert,
    broadCastUpdate,
    broadCastDelete,
    broadCastFindById
} = require('../repository/broadCastRepository');
const { sendToAllMessage } = require('./sendMessage');

function createBroadCastWindow(id) {
    const screenWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js'),
            contextIsolation: true
        },
        icon: path.join(__dirname, 'AppIcon.icns')
    });
    const idScreen = v4();
    global.windows[`${id}-${idScreen}`] = screenWindow;
    screenWindow.loadURL(
        isDev
            ? `http://localhost:3000/screen/${id}`
            : `file://${path.join(__dirname, `../../build/index.html#/screen/${id}`)}`
    );
    screenWindow.on('closed', () => {
        delete global.windows[`${id}-${idScreen}`];
    });
}

ipcMain.on('open-window-broadcast-request', (e, id) => {
    createBroadCastWindow(id);
});

ipcMain.handle('load-broadcast-request', async (e) => {
    const broadCasts = await broadCastFindAll();
    e.reply('load-broadcast-response', broadCasts);
});

ipcMain.handle('handle-load-broadcast-request', (e) => {
    return broadCastFindAll();
});

ipcMain.handle('handle-load-broadcast-request-by-id', (e, id) => {
    return broadCastFindById(id);
});

ipcMain.handle('handle-broadcast-insert-request', (e, broadCast) => {
    sendToAllMessage('broadcast-insert-message', 1);
    return broadCastInsert(broadCast);
});

ipcMain.handle('handle-broadcast-update-request', (e, _id, broadCast) => {
    sendToAllMessage('broadcast-update-message', 1);
    return broadCastUpdate(_id, broadCast);
});

ipcMain.handle('handle-broadcast-delete-request', async (e, _id) => {
    sendToAllMessage('broadcast-delete-message', 1);
    return broadCastDelete(_id);
});
