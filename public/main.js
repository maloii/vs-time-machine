const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const remoteMain = require('@electron/remote/main');
const { init } = require('./main/init');
require('./main/hardware/serialport');

remoteMain.initialize();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 1024,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'AppIcon.icns')
    });
    global.mainWindow = mainWindow;
    init();
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    remoteMain.enable(mainWindow.webContents);

    // Отображаем средства разработчика.
    // mainWindow.webContents.openDevTools();
}

app.allowRendererProcessReuse = false;

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    app.quit();
});
