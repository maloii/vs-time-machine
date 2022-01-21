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

const teamDelete = async (_id) => {
    const team = await teamFindById(_id);
    if (team) {
        const groups = (await db.group.find({ competitionId: team.competitionId })) || [];
        const laps = (await db.lap.find({ memberGroupId: _id })) || [];
        const groupsWithTeam = groups.filter((group) => (group.teams || []).map((item) => item._id).includes(_id));
        if (laps.length > 0 || groupsWithTeam.length > 0) {
            return Promise.reject('It is forbidden to remove an team while he is included in the group and has laps!');
        }
    }
    return db.team.remove({ _id }, {});
};

module.exports = { teamsFindByCompetitionId, teamFindById, teamInsert, teamUpdate, teamDelete };
