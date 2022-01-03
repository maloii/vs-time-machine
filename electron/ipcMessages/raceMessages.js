const { race } = require('../race/Race');
const { ipcMain } = require('electron');

ipcMain.on('race-start-request', async (e, group) => {
    race.start(group);
});

ipcMain.on('race-stop-request', async (e) => {
    race.stop();
});
