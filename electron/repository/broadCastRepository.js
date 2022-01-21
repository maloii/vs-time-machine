const { db } = require('./repository');

const broadCastFindAll = () => {
    return db.broadcast.find({});
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

module.exports = { broadCastFindAll, broadCastFindById, broadCastInsert, broadCastUpdate, broadCastDelete };
