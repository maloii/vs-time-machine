const { db } = require('./repository');

const groupsFindByRoundId = async (roundId) => {
    return db.group.find({ roundId });
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

const groupDelete = (_id) => {
    return db.group.remove({ _id }, {});
};

module.exports = { groupsFindByRoundId, groupInsert, groupUpdate, groupSelect, groupDelete };
