const { ipcMain } = require('electron');
const { teamsFindByCompetitionId, teamInsert, teamUpdate, teamDelete } = require('../repository/teamRepository');
const { sendToAllMessage } = require('./sendMessage');

ipcMain.on('load-teams-for-competition-request', async (e, competitionId) => {
    const teams = await teamsFindByCompetitionId(competitionId);
    sendToAllMessage('load-teams-for-competition-response', teams);
});

ipcMain.on('team-insert-request', async (e, team) => {
    const count = await teamInsert(team);
    sendToAllMessage('team-insert-response', count);
});

ipcMain.on('team-update-request', async (e, _id, team) => {
    const count = await teamUpdate(_id, team);
    sendToAllMessage('team-update-response', count);
});

ipcMain.handle('team-delete-request', async (e, _id) => {
    return teamDelete(_id);
});
