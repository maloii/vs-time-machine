const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { v4 } = require('uuid');
const {
    broadCastFindByCompetitionId,
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
        isDev ? `http://localhost:3000/screen/${id}` : `file://${path.join(__dirname, '../../build/index.html')}`,
        isDev ? undefined : { hash: `/screen/${id}` }
    );
    screenWindow.on('closed', () => {
        delete global.windows[`${id}-${idScreen}`];
    });
}

ipcMain.on('open-window-broadcast-request', (e, id) => {
    createBroadCastWindow(id);
});

ipcMain.on('load-broadcast-request', async (e, competitionId) => {
    const broadCasts = await broadCastFindByCompetitionId(competitionId);
    sendToAllMessage('load-broadcast-response', broadCasts);
});

ipcMain.handle('handle-load-broadcast-request', (e, competitionId) => {
    return broadCastFindByCompetitionId(competitionId);
});

ipcMain.handle('handle-load-broadcast-request-by-id', (e, id) => {
    return broadCastFindById(id);
});

ipcMain.on('broadcast-insert-request', async (e, broadCast) => {
    const count = await broadCastInsert(broadCast);
    sendToAllMessage('broadcast-insert-response', count);
});

ipcMain.handle('handle-broadcast-insert-request', (e, broadCast) => {
    sendToAllMessage('broadcast-insert-response', 1);
    return broadCastInsert(broadCast);
});

ipcMain.on('broadcast-update-request', async (e, _id, broadCast) => {
    const count = await broadCastUpdate(_id, broadCast);
    sendToAllMessage('broadcast-update-response', count);
});

ipcMain.handle('handle-broadcast-update-request', (e, _id, broadCast) => {
    sendToAllMessage('broadcast-update-response', 1);
    return broadCastUpdate(_id, broadCast);
});

ipcMain.on('broadcast-delete-request', async (e, _id) => {
    const count = await broadCastDelete(_id);
    sendToAllMessage('broadcast-delete-response', count);
});

ipcMain.handle('handle-broadcast-delete-request', (e, _id) => {
    sendToAllMessage('broadcast-delete-response', 1);
    return broadCastDelete(_id);
});
