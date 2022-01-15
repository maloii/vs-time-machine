const { db } = require('./repository');

const groupsFindByRoundId = async (roundId) => {
    return db.group.find({ roundId });
};

const groupsFindByRoundIds = async (roundIds) => {
    return db.group.find({ roundId: { $in: roundIds } });
};

const groupInsert = (group) => {
    return db.group.insert(group);
};

const groupUpdate = (_id, group) => {
    return db.group.update(
        { _id },
        {
            $set: {
                ...group
            }
        }
    );
};

const groupSelect = async (roundId, _id) => {
    await db.group.update({ roundId }, { $set: { selected: false } }, { multi: true });
    return db.group.update({ _id }, { $set: { selected: true } });
};

const groupDelete = async (_id) => {
    let count = 0;
    count += await db.lap.remove({ groupId: _id }, { multi: true });
    count += await db.group.remove({ _id }, {});
    return count;
};

module.exports = { groupsFindByRoundId, groupsFindByRoundIds, groupInsert, groupUpdate, groupSelect, groupDelete };
