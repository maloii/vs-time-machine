const {
    groupsFindByRoundId,
    groupsFindByRoundIds,
    groupInsert,
    groupUpdate,
    groupSelect,
    groupDelete
} = require('../repository/groupRepository');
const { ipcMain } = require('electron');

ipcMain.on('load-groups-for-round-request', async (e, roundId) => {
    const groups = await groupsFindByRoundId(roundId);
    e.reply('load-groups-for-round-response', groups);
});

ipcMain.handle('handle-load-groups-for-round-request', async (e, roundId) => {
    return groupsFindByRoundId(roundId);
});

ipcMain.handle('handle-load-groups-for-rounds-request', async (e, roundIds) => {
    return groupsFindByRoundIds(roundIds);
});

ipcMain.on('group-insert-request', async (e, group) => {
    const count = await groupInsert(group);
    e.reply('group-insert-response', count);
});

ipcMain.on('group-update-request', async (e, _id, group) => {
    const count = await groupUpdate(_id, group);
    e.reply('group-update-response', count);
});

ipcMain.on('group-select-request', async (e, roundId, _id) => {
    const count = await groupSelect(roundId, _id);
    e.reply('group-select-response', count);
});

ipcMain.on('group-delete-request', async (e, _id) => {
    const count = await groupDelete(_id);
    e.reply('group-delete-response', count);
});
