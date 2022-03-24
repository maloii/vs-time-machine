const {
    competitionFindAll,
    competitionInsert,
    competitionUpdate,
    competitionDelete
} = require('../repository/competitionRepository');

const { ipcMain } = require('electron');
const { sendToAllMessage } = require('./sendMessage');

ipcMain.on('load-competitions-request', async (e) => {
    const competitions = await competitionFindAll();
    sendToAllMessage('load-competitions-response', competitions);
});

ipcMain.on('competition-insert-request', async (e, competition) => {
    const count = await competitionInsert(competition);
    sendToAllMessage('competition-insert-response', count);
});

ipcMain.on('competition-update-request', async (e, _id, competition) => {
    const count = await competitionUpdate(_id, competition);
    sendToAllMessage('competition-update-response', count);
});

ipcMain.on('competition-delete-request', async (e, _id) => {
    const count = await competitionDelete(_id);
    sendToAllMessage('competition-delete-response', count);
});
