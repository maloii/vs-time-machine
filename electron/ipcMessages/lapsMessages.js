const {
    lapsFindByGroupId,
    lapsFindByRoundId,
    lapsFindByRoundIds,
    lapUpdate,
    lapDelete,
    lapInsert
} = require('../repository/lapRepository');
const { ipcMain } = require('electron');
const { sendToAllMessage } = require('./sendMessage');

ipcMain.on('load-laps-for-group-request', async (e, groupId) => {
    const laps = await lapsFindByGroupId(groupId);
    sendToAllMessage('load-laps-for-group-response', laps);
});

ipcMain.handle('handle-load-laps-for-round-request', async (event, roundId) => {
    return lapsFindByRoundId(roundId);
});

ipcMain.handle('handle-load-laps-for-rounds-request', async (event, roundIds) => {
    return lapsFindByRoundIds(roundIds);
});

ipcMain.on('lap-insert-request', async (e, lap) => {
    const newLap = await lapInsert(lap);
    sendToAllMessage('new-lap-update', newLap);
});

ipcMain.on('lap-update-request', async (e, _id, lap) => {
    const count = await lapUpdate(_id, lap);
    sendToAllMessage('lap-update-response', count);
});

ipcMain.on('lap-delete-request', async (e, _id) => {
    const count = await lapDelete(_id);
    sendToAllMessage('lap-delete-response', count);
});
