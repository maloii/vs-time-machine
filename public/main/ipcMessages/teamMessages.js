const { ipcMain } = require('electron');
const { teamsFindByCompetitionId, teamInsert, teamUpdate, teamDelete } = require('../repository/teamRepository');

ipcMain.on('load-teams-for-competition-request', async (e, competitionId) => {
    const teams = await teamsFindByCompetitionId(competitionId);
    e.reply('load-teams-for-competition-response', teams);
});

ipcMain.on('team-insert-request', async (e, team) => {
    const count = await teamInsert(team);
    e.reply('team-insert-response', count);
});

ipcMain.on('team-update-request', async (e, _id, team) => {
    const count = await teamUpdate(_id, team);
    e.reply('team-update-response', count);
});

ipcMain.on('team-delete-request', async (e, _id) => {
    const count = await teamDelete(_id);
    e.reply('team-delete-response', count);
});
