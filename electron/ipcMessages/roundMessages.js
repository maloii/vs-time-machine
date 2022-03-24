const {
    roundsFindByCompetitionId,
    roundInsert,
    roundUpdate,
    roundSelect,
    roundDelete
} = require('../repository/roundRepository');
const { ipcMain } = require('electron');
const { sendToAllMessage } = require('./sendMessage');

ipcMain.on('load-rounds-for-competition-request', async (e, competitionId) => {
    const rounds = await roundsFindByCompetitionId(competitionId);
    sendToAllMessage('load-rounds-for-competition-response', rounds);
});

ipcMain.on('round-insert-request', async (e, competitionId, round) => {
    const count = await roundInsert(competitionId, round);
    sendToAllMessage('round-insert-response', count);
});

ipcMain.on('round-update-request', async (e, _id, round) => {
    const count = await roundUpdate(_id, round);
    sendToAllMessage('round-update-response', count);
});

ipcMain.on('round-select-request', async (e, competitionId, _id) => {
    const count = await roundSelect(competitionId, _id);
    sendToAllMessage('round-select-response', count);
});

ipcMain.on('round-delete-request', async (e, _id) => {
    const count = await roundDelete(_id);
    sendToAllMessage('round-delete-response', count);
});
