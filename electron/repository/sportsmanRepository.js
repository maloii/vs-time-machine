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

const sportsmanDelete = (_id) => {
    return db.sportsman.remove({ _id }, {});
};

module.exports = { sportsmenFindByCompetitionId, sportsmanFindById, sportsmanInsert, sportsmanUpdate, sportsmanDelete };
