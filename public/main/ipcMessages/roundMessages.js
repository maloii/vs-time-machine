const {
    roundsFindByCompetitionId,
    roundInsert,
    roundUpdate,
    roundSelect,
    roundDelete
} = require('../repository/roundRepository');
const { ipcMain } = require('electron');

ipcMain.on('load-rounds-for-competition-request', async (e, competitionId) => {
    const rounds = await roundsFindByCompetitionId(competitionId);
    e.reply('load-rounds-for-competition-response', rounds);
});

ipcMain.on('round-insert-request', async (e, competitionId, round) => {
    const count = await roundInsert(competitionId, round);
    e.reply('round-insert-response', count);
});

ipcMain.on('round-update-request', async (e, _id, round) => {
    const count = await roundUpdate(_id, round);
    e.reply('round-update-response', count);
});

ipcMain.on('round-select-request', async (e, competitionId, _id) => {
    const count = await roundSelect(competitionId, _id);
    e.reply('round-select-response', count);
});

ipcMain.on('round-delete-request', async (e, _id) => {
    const count = await roundDelete(_id);
    e.reply('round-delete-response', count);
});
