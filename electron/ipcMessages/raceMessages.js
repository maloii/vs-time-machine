const { race } = require('../race/Race');
const { ipcMain } = require('electron');

ipcMain.on('race-invitation-request', async (e, group) => {
    race.invitation(group);
});

ipcMain.on('race-start-request', async (e, group) => {
    race.start(group);
});

ipcMain.on('search-start-request', async (e, group) => {
    race.search(group);
});

ipcMain.on('race-stop-request', async (e) => {
    race.stop();
});

ipcMain.handle('handle-race-start-time-request', async (e) => {
    return race.startTime;
});

ipcMain.handle('handle-race-status-request', async (e) => {
    return race.raceStatus;
});
