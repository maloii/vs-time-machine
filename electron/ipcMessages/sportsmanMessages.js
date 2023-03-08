const { ipcMain } = require('electron');
const {
    sportsmenFindByCompetitionId,
    sportsmanInsert,
    sportsmanUpdate,
    sportsmanDelete
} = require('../repository/sportsmanRepository');
const { sendToAllMessage } = require('./sendMessage');

ipcMain.on('load-sportsmen-for-competition-request', async (e, competitionId) => {
    const sportsmen = await sportsmenFindByCompetitionId(competitionId);
    e.reply('load-sportsmen-for-competition-response', sportsmen);
});

ipcMain.handle('handle-load-sportsmen-for-competition-request', async (e, competitionId) => {
    return sportsmenFindByCompetitionId(competitionId);
});

ipcMain.on('sportsman-insert-request', async (e, sportsman) => {
    const count = await sportsmanInsert(sportsman);
    sendToAllMessage('sportsman-insert-response', count);
});

ipcMain.on('sportsman-update-request', async (e, _id, sportsman) => {
    const count = await sportsmanUpdate(_id, sportsman);
    sendToAllMessage('sportsman-update-response', count);
    sendToAllMessage('round-update-response', count);
});

ipcMain.handle('sportsman-delete-request', async (e, _id) => {
    return sportsmanDelete(_id);
});
