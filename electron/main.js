const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const stayAwake = require('stay-awake');
const { init } = require('./init');
const { mainMenu } = require('./menu/mainMenu');
require('./ipcMessages');

function createWindow() {
    stayAwake.prevent();
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            contextIsolation: true,
            webSecurity: false
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
    Menu.setApplicationMenu(mainMenu);
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    stayAwake.allow();
    app.quit();
});

// i18n.on('loaded', (loaded) => {
//     i18n.changeLanguage(app.getLocale());
//     i18n.off('loaded');
// });

// i18n.on('languageChanged', (lng) => {
//     menuFactoryService.buildMenu(app, win, i18n);
//     win.webContents.send('language-changed', {
//         language: lng,
//         namespace: config.namespace,
//         resource: i18n.getResourceBundle(lng, config.namespace)
//     });
// });
