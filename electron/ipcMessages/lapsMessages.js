const { lapsFindByGroupId, lapUpdate, lapDelete } = require('../repository/lapRepository');
const { ipcMain } = require('electron');

ipcMain.on('load-laps-for-group-request', async (e, groupId) => {
    const laps = await lapsFindByGroupId(groupId);
    e.reply('load-laps-for-group-response', laps);
});

ipcMain.on('lap-update-request', async (e, _id, lap) => {
    const count = await lapUpdate(_id, lap);
    e.reply('lap-update-response', count);
});

ipcMain.on('lap-delete-request', async (e, _id) => {
    const count = await lapDelete(_id);
    e.reply('lap-delete-response', count);
});
