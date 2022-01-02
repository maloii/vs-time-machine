const { lapsFindByGroupId } = require('../repository/lapRepository');
const { ipcMain } = require('electron');

ipcMain.on('load-laps-for-group-request', async (e, groupId) => {
    const laps = await lapsFindByGroupId(groupId);
    e.reply('load-laps-for-group-response', laps);
});
