const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;
const isDev = require('electron-is-dev');
const remoteMain = require('@electron/remote/main');

remoteMain.initialize();

const PHOTO_FOLDER = 'photo';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 1024,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'AppIcon.icns')
    });

    copyFileEmptyPerson();
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

ipcMain.on('setMyGlobalVariable', (event, myGlobalVariableValue) => {
    global.myGlobalVariable = myGlobalVariableValue;
});

function copyFileEmptyPerson() {
    const pathPhoto = `${app.getPath('userData')}/${PHOTO_FOLDER}`;
    if (!fs.existsSync(pathPhoto)) {
        fs.mkdirSync(pathPhoto);
    }
    if (!fs.existsSync(`${pathPhoto}/empty_person.png`)) {
        fsPromise
            .copyFile(path.join(__dirname, '../build/photo/empty_person.png'), `${pathPhoto}/empty_person.png`)
            .then(() => {});
    }
}
