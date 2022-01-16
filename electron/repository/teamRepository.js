const { db } = require('./repository');

const teamsFindByCompetitionId = (competitionId) => {
    return db.team.find({ competitionId });
};

const teamFindById = (_id) => {
    return db.team.findOne({ _id });
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

module.exports = { teamsFindByCompetitionId, teamFindById, teamInsert, teamUpdate, teamDelete };
