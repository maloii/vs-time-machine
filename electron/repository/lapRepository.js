const { db } = require('./repository');

const lapsFindByGroupId = (groupId) => {
    return db.lap.find({ groupId });
};

const lapsFindByRoundId = (roundId) => {
    return db.lap.find({ roundId });
};

const lapsFindByRoundIds = (roundIds) => {
    return db.lap.find({ roundId: { $in: roundIds } });
};

const lapsFindByMemberGroupId = (memberGroupId, groupId) => {
    return db.lap.find({ memberGroupId, groupId });
};

const lapInsert = (lap) => {
    return db.lap.insert(lap);
};

const lapUpdate = (_id, lap) => {
    return db.lap.update(
        { _id },
        {
            $set: {
                ...lap
            }
        }
    );
};

const lapDelete = (_id) => {
    return db.lap.remove({ _id }, {});
};

const lapDeleteByGroupId = (groupId) => {
    return db.lap.remove({ groupId }, { multi: true });
};

module.exports = {
    lapsFindByGroupId,
    lapsFindByRoundId,
    lapsFindByRoundIds,
    lapsFindByMemberGroupId,
    lapInsert,
    lapUpdate,
    lapDelete,
    lapDeleteByGroupId
};
