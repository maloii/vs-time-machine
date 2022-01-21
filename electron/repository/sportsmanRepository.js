const { db } = require('./repository');

const sportsmenFindByCompetitionId = (competitionId) => {
    return db.sportsman.find({ competitionId });
};

const sportsmanFindById = (_id) => {
    return db.sportsman.findOne({ _id });
};

const sportsmanInsert = (sportsman) => {
    return db.sportsman.insert(sportsman);
};

const sportsmanUpdate = (_id, sportsman) => {
    return db.sportsman.update(
        { _id },
        {
            $set: {
                ...sportsman
            }
        }
    );
};

const sportsmanDelete = async (_id) => {
    const sportsman = await sportsmanFindById(_id);
    if (sportsman) {
        const groups = (await db.group.find({ competitionId: sportsman.competitionId })) || [];
        const laps = (await db.lap.find({ memberGroupId: _id })) || [];
        const groupsWithSportsman = groups.filter((group) =>
            (group.sportsmen || []).map((item) => item._id).includes(_id)
        );
        if (laps.length > 0 || groupsWithSportsman.length > 0) {
            return Promise.reject(
                'It is forbidden to remove an sportsman while he is included in the group and has laps!'
            );
        }
    }

    return db.sportsman.remove({ _id }, {});
};

module.exports = { sportsmenFindByCompetitionId, sportsmanFindById, sportsmanInsert, sportsmanUpdate, sportsmanDelete };
