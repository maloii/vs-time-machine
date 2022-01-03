const { app } = require('electron');
const Datastore = require('nedb-promises');
const isDev = require('electron-is-dev');

const dbFactory = (fileName) =>
    Datastore.create({
        filename: `${isDev ? '.' : app.getPath('userData')}/db/${fileName}`,
        timestampData: true,
        autoload: true
    });

const db = {
    competition: dbFactory('competition.db'),
    sportsman: dbFactory('sportsman.db'),
    team: dbFactory('team.db'),
    round: dbFactory('round.db'),
    group: dbFactory('group.db'),
    lap: dbFactory('lap.db')
};

db.competition.ensureIndex({ fieldName: 'selected' });
db.sportsman.ensureIndex({ fieldName: 'competitionId' });
db.team.ensureIndex({ fieldName: 'competitionId' });
db.round.ensureIndex({ fieldName: 'competitionId' });
db.group.ensureIndex({ fieldName: 'roundId' });

module.exports = { db };
