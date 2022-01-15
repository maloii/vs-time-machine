const { db } = require('./repository');

const roundsFindByCompetitionId = async (competitionId) => {
    return db.round.find({ competitionId });
};

const roundInsert = async (competitionId, round) => {
    let count = 0;
    const rounds = await roundsFindByCompetitionId(competitionId);
    count += (
        await Promise.all(
            rounds.map(async (item, indx) => {
                return await db.round.update(
                    { _id: item._id },
                    {
                        $set: { selected: false, sort: indx }
                    }
                );
            })
        )
    ).reduce((res, item) => res + item, 0);
    count += db.round.insert({ ...round, competitionId, sort: rounds.length, selected: true });
    return count;
};

const roundUpdate = (_id, round) => {
    return db.round.update(
        { _id },
        {
            $set: {
                ...round
            }
        }
    );
};

const roundSelect = async (competitionId, _id) => {
    await db.round.update({ competitionId }, { $set: { selected: false } }, { multi: true });
    return db.round.update({ _id }, { $set: { selected: true } });
};

const roundDelete = async (_id) => {
    let count = 0;
    const round = await db.round.findOne({ _id });
    if (round) {
        count += await db.round.remove({ _id }, {});
        const rounds = await roundsFindByCompetitionId(round.competitionId);
        if ((rounds || []).length > 0) {
            const newSelectedRound = rounds[rounds.length - 1];
            count += await db.round.update({ _id: newSelectedRound._id }, { $set: { selected: true } });
        }
        const groups = await db.group.find({ roundId: round._id });
        for (const group in groups) {
            count += await db.lap.remove({ groupId: group._id }, { multi: true });
        }
        count += await db.group.remove({ roundId: round._id }, { multi: true });
    }
    return count;
};

module.exports = { roundsFindByCompetitionId, roundInsert, roundUpdate, roundSelect, roundDelete };
