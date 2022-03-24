const {
    groupsFindByCompetitionId,
    groupsFindByRoundId,
    groupsFindByRoundIds,
    groupInsert,
    groupUpdate,
    groupSelect,
    groupDelete,
    groupFindById
} = require('../repository/groupRepository');
const { ipcMain } = require('electron');
const { sendToAllMessage } = require('./sendMessage');

ipcMain.on('load-groups-for-round-request', async (e, roundId) => {
    const groups = await groupsFindByRoundId(roundId);
    sendToAllMessage('load-groups-for-round-response', groups);
});

ipcMain.handle('handle-load-groups-for-round-request', async (e, roundId) => {
    return groupsFindByRoundId(roundId);
});

ipcMain.handle('handle-load-groups-for-rounds-request', async (e, roundIds) => {
    return groupsFindByRoundIds(roundIds);
});

ipcMain.handle('handle-load-group-by-id-request', async (e, _id) => {
    return groupFindById(_id);
});

ipcMain.handle('handle-groups-for-competition-request', async (e, competitionId) => {
    return groupsFindByCompetitionId(competitionId);
});

ipcMain.on('group-insert-request', async (e, group) => {
    const count = await groupInsert(group);
    sendToAllMessage('group-insert-response', count);
});

ipcMain.on('group-update-request', async (e, _id, group) => {
    const count = await groupUpdate(_id, group);
    sendToAllMessage('group-update-response', count);
});

ipcMain.on('group-select-request', async (e, roundId, _id) => {
    const count = await groupSelect(roundId, _id);
    sendToAllMessage('group-select-response', count);
});

ipcMain.on('group-delete-request', async (e, _id) => {
    const count = await groupDelete(_id);
    sendToAllMessage('group-delete-response', count);
});
