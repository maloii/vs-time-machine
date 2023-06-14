const { ipcMain } = require('electron');
const settings = require('electron-settings');
const { getWindowsVoices } = require('../speech/speech');

ipcMain.handle('get-setting-value', (event, key) => {
    return settings.get(key);
});

ipcMain.handle('set-setting-value', (event, key, value) => {
    return settings.set(key, value);
});

ipcMain.handle('get-windows-voices', (event) => {
    return getWindowsVoices();
});
