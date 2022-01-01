const { app } = window.require('electron').remote;
const Datastore = window.require('nedb-promises');

const dbFactory = (fileName: string) =>
    Datastore.create({
        filename: `${process.env.NODE_ENV === 'development' ? '.' : app.getPath('userData')}/db/${fileName}`,
        timestampData: true,
        autoload: true
    });

interface IRepository {
    competition: Datastore;
    sportsman: Datastore;
    team: Datastore;
    round: Datastore;
    group: Datastore;
    lap: Datastore;
}

export const db: IRepository = {
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
