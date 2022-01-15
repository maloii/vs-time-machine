const _ = require('lodash');
const { db } = require('./repository');
const { sportsmenFindByCompetitionId } = require('./sportsmanRepository');
const { teamsFindByCompetitionId } = require('./teamRepository');
const { competitionFindById } = require('./competitionRepository');
const { competitionColorAndChannel } = require('../utils/competitionColorAndChannel');
const { groupInsert, groupsFindByRoundId } = require('./groupRepository');

const roundsFindByCompetitionId = async (competitionId) => {
    return db.round.find({ competitionId });
};

const roundsFindById = async (_id) => {
    return db.round.findOne({ _id });
};

const roundInsert = async (competitionId, round) => {
    let count = 0;
    const rounds = await roundsFindByCompetitionId(competitionId);
    count += (
        await Promise.all(
            rounds
                .sort((a, b) => a.sort - b.sort)
                .map(async (item, indx) => {
                    return await db.round.update(
                        { _id: item._id },
                        {
                            $set: { selected: false, sort: indx }
                        }
                    );
                })
        )
    ).reduce((res, item) => res + item, 0);
    count += db.round.insert({ ...round, competitionId, sort: rounds.length, selected: true }).then((newRound) => {
        if (newRound.typeGenerateRound === 'RANDOM') {
            generateRandomGroups(newRound);
        } else if (newRound.typeGenerateRound === 'COPY_BEFORE_ROUND') {
            generateGroupsFromBeforeRound(newRound);
        }
    });
    return count;
};

const generateRandomGroups = async (round) => {
    const competition = await competitionFindById(round.competitionId);
    if (competition) {
        Promise.all([
            sportsmenFindByCompetitionId(round.competitionId),
            teamsFindByCompetitionId(round.competitionId)
        ]).then(async ([resSportsmen, resTeams]) => {
            const sportsmen = _.shuffle((resSportsmen || []).filter((item) => item.selected));
            const teams = _.shuffle((resTeams || []).filter((item) => item.selected));

            let group = {
                roundId: round._id,
                name: 'Group 1',
                sort: 0,
                selected: true,
                close: false,
                typeGroup: 'NONE',
                sportsmen: [],
                teams: []
            };
            if (sportsmen.length > 0) {
                for (let i = 0; i < sportsmen.length; i++) {
                    if (i !== 0 && i % round.countSportsmen === 0) {
                        await groupInsert(group);
                        group = {
                            roundId: round._id,
                            name: `Group ${group.sort + 2}`,
                            sort: group.sort + 1,
                            selected: false,
                            close: false,
                            typeGroup: 'NONE',
                            sportsmen: [],
                            teams: []
                        };
                    }

                    group.sportsmen = [...group.sportsmen, { _id: sportsmen[i]._id }].map((item, idx) => {
                        const startNumber = idx + 1;
                        const colorAndChannel = competitionColorAndChannel(startNumber, competition);
                        return {
                            ...item,
                            color: colorAndChannel?.color,
                            channel: colorAndChannel?.channel
                        };
                    });
                }
                if (group.sportsmen.length > 0) {
                    await groupInsert(group);
                }
            }
            if (teams.length > 0) {
                if (sportsmen.length > 0) {
                    group = {
                        roundId: round._id,
                        name: `Group ${group.sort + 2}`,
                        sort: group.sort + 1,
                        selected: false,
                        close: false,
                        typeGroup: 'NONE',
                        sportsmen: [],
                        teams: []
                    };
                }
                for (let i = 0; i < teams.length; i++) {
                    if (i !== 0 && i % round.countSportsmen === 0) {
                        await groupInsert(group);
                        group = {
                            roundId: round._id,
                            name: `Group ${group.sort + 2}`,
                            sort: group.sort + 1,
                            selected: false,
                            close: false,
                            typeGroup: 'NONE',
                            sportsmen: [],
                            teams: []
                        };
                    }

                    group.teams = [...group.teams, { _id: teams[i]._id }].map((item, idx) => {
                        const startNumber = idx + 1;
                        const colorAndChannel = competitionColorAndChannel(startNumber, competition);
                        return {
                            ...item,
                            color: colorAndChannel?.color,
                            channel: colorAndChannel?.channel
                        };
                    });
                }
                if (group.teams.length > 0) {
                    await groupInsert(group);
                }
            }
        });
    }
};

const generateGroupsFromBeforeRound = async (round) => {
    return groupsFindByRoundId(round.fromRoundCopy).then((groups) => {
        groups.forEach(async (group) => {
            const newGroup = {
                ...group,
                _id: undefined,
                roundId: round._id,
                sportsmen: group?.sportsmen?.map((sportsman) => ({
                    ...sportsman,
                    searchTransponder: undefined,
                    searchTeamSportsmenIds: undefined
                })),
                teams: group?.teams?.map((team) => ({
                    ...team,
                    searchTransponder: undefined,
                    searchTeamSportsmenIds: undefined
                }))
            };
            await groupInsert(newGroup);
        });
    });
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

module.exports = { roundsFindByCompetitionId, roundsFindById, roundInsert, roundUpdate, roundSelect, roundDelete };
