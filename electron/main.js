const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { init } = require('./init');
require('./ipcMessages');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            contextIsolation: true
        },
        icon: path.join(__dirname, 'AppIcon.icns')
    });
    global.windows['main'] = mainWindow;
    init();
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    // Отображаем средства разработчика.
    // mainWindow.webContents.openDevTools();
}

app.allowRendererProcessReuse = false;

app.whenReady().then(() => {
    global.windows = {};
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    app.quit();
});
