const _ = require('lodash');
const { db } = require('./repository');
const { groupLapsByMemberGroup, positionCalculation } = require('../race/positionCalculation');

const groupsFindByRoundId = (roundId) => {
    return db.group.find({ roundId });
};

const groupsFindByRoundIds = (roundIds) => {
    return db.group.find({ roundId: { $in: roundIds } });
};

const groupInsert = (group) => {
    return db.group.insert(group);
};

const groupFindById = (_id) => {
    return db.group.findOne({ _id }).then(async (group) => {
        const sportsmen = await db.sportsman.find({ competitionId: group.competitionId });
        const teams = await db.team.find({ competitionId: group.competitionId });
        const groupWithSportsman = {
            ...group,
            sportsmen: group.sportsmen
                ?.map((item) => ({
                    ...item,
                    sportsman: _.find(sportsmen, ['_id', item._id])
                }))
                .filter((item) => !!item.sportsman),
            teams: group.teams
                ?.map((item) => ({
                    ..._.cloneDeep(item),
                    team: _.find(teams, ['_id', item._id])
                }))
                .map((item) => ({
                    ..._.cloneDeep(item),
                    team: {
                        ..._.cloneDeep(item.team),
                        sportsmen: (item?.team?.sportsmenIds || []).map((sportsmanId) =>
                            _.find(sportsmen, ['_id', sportsmanId])
                        )
                    }
                }))
                .filter((item) => !!item.team)
        };
        return groupWithSportsman;
    });
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

const groupSavePositions = async (_id) => {
    const group = await groupFindById(_id);
    const round = await db.round.findOne({ _id: group.roundId });
    const allLapsGroup = await db.lap.find({ groupId: _id });
    const laps = groupLapsByMemberGroup(group, allLapsGroup);
    const groupWithPositions = positionCalculation(round, group, laps);
    return groupUpdate(_id, groupWithPositions);
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

module.exports = {
    groupsFindByRoundId,
    groupsFindByRoundIds,
    groupFindById,
    groupInsert,
    groupUpdate,
    groupSavePositions,
    groupSelect,
    groupDelete
};
