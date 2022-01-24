const { db } = require('./repository');

const broadCastFindByCompetitionId = (competitionId) => {
    return db.broadcast.find({ competitionId });
};

const broadCastFindById = (_id) => {
    return db.broadcast.findOne({ _id });
};

const broadCastInsert = (broadCast) => {
    return db.broadcast.insert(broadCast);
};

const broadCastUpdate = (_id, broadCast) => {
    return db.broadcast.update(
        { _id },
        {
            $set: {
                ...broadCast
            }
        }
    );
};

const broadCastDelete = (_id) => {
    return db.broadcast.remove({ _id }, {});
};

module.exports = { broadCastFindByCompetitionId, broadCastFindById, broadCastInsert, broadCastUpdate, broadCastDelete };
