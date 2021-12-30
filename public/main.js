const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;
const isDev = require('electron-is-dev');
const remoteMain = require('@electron/remote/main');

remoteMain.initialize();

const IMAGES_FOLDER = 'images';

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

    copyDefaultImages();
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

function copyDefaultImages() {
    const pathImages = `${app.getPath('userData')}/${IMAGES_FOLDER}`;
    if (!fs.existsSync(pathImages)) {
        fs.mkdirSync(pathImages);
    }
    if (!fs.existsSync(`${pathImages}/empty_person.png`)) {
        fsPromise
            .copyFile(
                path.join(__dirname, `../build/${IMAGES_FOLDER}/empty_person.png`),
                `${pathImages}/empty_person.png`
            )
            .then(() => {});
    }
    if (!fs.existsSync(`${pathImages}/default_competition_logo.png`)) {
        fsPromise
            .copyFile(
                path.join(__dirname, `../build/${IMAGES_FOLDER}/default_competition_logo.png`),
                `${pathImages}/default_competition_logo.png`
            )
            .then(() => {});
    }
}
