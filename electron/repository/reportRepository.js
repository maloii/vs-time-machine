const { db } = require('./repository');

const reportFindByCompetitionId = (competitionId) => {
    return db.report.find({ competitionId });
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

module.exports = { reportFindByCompetitionId, reportInsert, reportUpdate, reportDelete };
