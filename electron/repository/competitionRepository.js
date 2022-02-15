const { db } = require('./repository');

const competitionFindAll = () => {
    return db.competition.find({});
};

const competitionFindById = (_id) => {
    return db.competition.findOne({ _id });
};

const competitionClearSelect = () => {
    return db.competition.update({ selected: true }, { $set: { selected: false } }, { multi: true });
};

const competitionInsert = async (competition) => {
    if (competition.selected) {
        await competitionClearSelect();
    }
    return db.competition.insert(competition);
};

const competitionUpdate = async (_id, competition) => {
    if (competition.selected) {
        await competitionClearSelect();
    }
    return db.competition.update(
        { _id },
        {
            $set: {
                ...competition
            }
        }
    );
};

const competitionDelete = async (_id) => {
    let count = 0;
    const competition = await db.competition.findOne({ _id });
    if (competition) {
        count += await db.sportsman.remove({ competitionId: _id }, { multi: true });
        count += await db.team.remove({ competitionId: _id }, { multi: true });
        const rounds = await db.round.find({ competitionId: _id });
        for (const round of rounds) {
            const groups = await db.group.find({ roundId: round._id });
            for (const group of groups) {
                count += await db.lap.remove({ groupId: group._id }, { multi: true });
            }
            count += await db.group.remove({ roundId: round._id }, { multi: true });
        }
        count += await db.round.remove({ competitionId: _id }, { multi: true });
        count += await db.competition.remove({ _id }, {});
        if (competition.selected) {
            const competitions = await competitionFindAll();
            if ((competitions || []).length > 0) {
                const newSelectedCompetitions = competitions[competitions.length - 1];
                await db.competition.update(
                    { _id: newSelectedCompetitions._id },
                    { $set: { selected: true } },
                    { multi: true }
                );
            }
        }
    }
    return count;
};

module.exports = { competitionFindAll, competitionFindById, competitionInsert, competitionUpdate, competitionDelete };
