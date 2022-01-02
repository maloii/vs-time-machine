const { db } = require('./repository');

const lapsFindByGroupId = (groupId) => {
    return db.lap.find({ groupId });
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

module.exports = { lapsFindByGroupId, lapInsert, lapUpdate, lapDelete };
