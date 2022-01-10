const { db } = require('./repository');

const reportFindAll = () => {
    return db.report.find({});
};

const reportInsert = async (report) => {
    return db.report.insert(report);
};

const reportUpdate = async (_id, report) => {
    return db.report.update(
        { _id },
        {
            $set: {
                ...report
            }
        }
    );
};

const reportDelete = async (_id) => {
    return db.report.remove({ _id }, {});
};

module.exports = { reportFindAll, reportInsert, reportUpdate, reportDelete };
