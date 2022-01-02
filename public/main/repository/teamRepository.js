const { db } = require('./repository');

const teamsFindByCompetitionId = (competitionId) => {
    return db.team.find({ competitionId });
};

const teamInsert = (team) => {
    return db.team.insert(team);
};

const teamUpdate = (_id, team) => {
    return db.team.update(
        { _id },
        {
            $set: {
                ...team
            }
        }
    );
};

const teamDelete = (_id) => {
    return db.team.remove({ _id }, {});
};

module.exports = { teamsFindByCompetitionId, teamInsert, teamUpdate, teamDelete };
