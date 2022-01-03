const {
    competitionFindAll,
    competitionInsert,
    competitionUpdate,
    competitionDelete
} = require('../repository/competitionRepository');

const { ipcMain } = require('electron');

ipcMain.on('load-competitions-request', async (e) => {
    const competitions = await competitionFindAll();
    e.reply('load-competitions-response', competitions);
});

ipcMain.on('competition-insert-request', async (e, competition) => {
    const count = await competitionInsert(competition);
    e.reply('competition-insert-response', count);
});

ipcMain.on('competition-update-request', async (e, _id, competition) => {
    const count = await competitionUpdate(_id, competition);
    e.reply('competition-update-response', count);
});

ipcMain.on('competition-delete-request', async (e, _id) => {
    const count = await competitionDelete(_id);
    e.reply('competition-delete-response', count);
});
