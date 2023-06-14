const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { v4 } = require('uuid');

const isMac = process.platform === 'darwin';

const mainMenu = Menu.buildFromTemplate([
    ...(isMac
        ? [
              {
                  label: app.name,
                  submenu: [
                      { role: 'about' },
                      { type: 'separator' },
                      { role: 'services' },
                      { type: 'separator' },
                      { role: 'hide' },
                      { role: 'hideOthers' },
                      { role: 'unhide' },
                      { type: 'separator' },
                      { role: 'quit' }
                  ]
              }
          ]
        : []),
    {
        label: 'File',
        submenu: [
            {
                label: 'Import sportsmen from',
                submenu: [
                    {
                        label: 'rcpilots.pro',
                        click: () => {
                            const importWindow = new BrowserWindow({
                                width: 800,
                                height: 800,
                                webPreferences: {
                                    preload: path.join(__dirname, '../preload.js'),
                                    contextIsolation: true,
                                    webSecurity: false
                                },
                                icon: path.join(__dirname, 'AppIcon.icns')
                            });
                            const idScreen = v4();
                            global.windows[idScreen] = importWindow;

                            importWindow.loadURL(
                                isDev
                                    ? 'http://localhost:3000/import/rcpilots'
                                    : `file://${path.join(__dirname, '../../build/index.html#/import/rcpilots')}`
                            );

                            importWindow.on('closed', () => {
                                delete global.windows[idScreen];
                            });
                        }
                    }
                ]
            },
            {
                label: 'Settings',
                click: () => {
                    const importWindow = new BrowserWindow({
                        width: 800,
                        height: 800,
                        webPreferences: {
                            preload: path.join(__dirname, '../preload.js'),
                            contextIsolation: true,
                            webSecurity: false
                        },
                        icon: path.join(__dirname, 'AppIcon.icns')
                    });
                    const idScreen = v4();
                    global.windows[idScreen] = importWindow;

                    importWindow.loadURL(
                        isDev
                            ? 'http://localhost:3000/settings'
                            : `file://${path.join(__dirname, '../../build/index.html')}#/settings`
                    );

                    importWindow.on('closed', () => {
                        delete global.windows[idScreen];
                    });
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac
                ? [
                      { role: 'pasteAndMatchStyle' },
                      { role: 'delete' },
                      { role: 'selectAll' },
                      { type: 'separator' },
                      {
                          label: 'Speech',
                          submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
                      }
                  ]
                : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac
                ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
                : [{ role: 'close' }])
        ]
    }
]);

module.exports = { mainMenu };
