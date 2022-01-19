const _ = require('lodash');
const positionCalculation = (round, group, groupedLaps) => {
    let memberGroup = [...group.sportsmen, ...group.teams];
    if (['FIXED_TIME', 'FIXED_TIME_AND_ONE_LAP_AFTER'].includes(round.typeRace)) {
        memberGroup.sort((m1, m2) => {
            const m1Laps = groupedLaps?.[m1._id] || [];
            const m2Laps = groupedLaps?.[m2._id] || [];
            // Если колличество кругов одинакого то по лучшему кругу
            if (m1Laps.length === m2Laps.length) {
                return _.minBy(m1Laps, 'timeLap')?.timeLap - _.minBy(m2Laps, 'timeLap')?.timeLap;
            }
            return m2Laps.length - m1Laps.length;
        });
    }
    if (round.typeRace === 'FIXED_COUNT_LAPS') {
        memberGroup.sort((m1, m2) => {
            const m1Laps = groupedLaps?.[m1._id] || [];
            const m2Laps = groupedLaps?.[m2._id] || [];
            // Если колличество кругов одинакого то кто раньше прилетел
            if (m1Laps.length === m2Laps.length && m2Laps.length > 0) {
                return m1Laps[m1Laps.length - 1]?.millisecond - m2Laps[m2Laps.length - 1]?.millisecond;
            }
            return m2Laps.length - m1Laps.length;
        });
    }

    return {
        ...group,
        sportsmen: group.sportsmen.map((sportsman) => ({
            ...sportsman,
            position:
                groupedLaps[sportsman._id]?.length > 0
                    ? _.findIndex(memberGroup, ['_id', sportsman._id]) + 1
                    : undefined
        })),
        teams: group.teams.map((team) => ({
            ...team,
            position: groupedLaps[team._id]?.length > 0 ? _.findIndex(memberGroup, ['_id', team._id]) + 1 : undefined
        }))
    };
};

const groupLapsByMemberGroup = (group, laps, withPitStop = false) => {
    const groupedLaps = {};
    [...group.sportsmen, ...group.teams].forEach((item) => {
        groupedLaps[item._id] = _.sortBy(
            (laps || []).filter(
                (lap) =>
                    lap.memberGroupId === item._id &&
                    (withPitStop
                        ? ['START', 'OK', 'PIT_STOP_END'].includes(lap.typeLap) && lap.timeLap
                        : ['START', 'OK'].includes(lap.typeLap))
            ),
            ['millisecond']
        );
    });
    return groupedLaps;
};

module.exports = { positionCalculation, groupLapsByMemberGroup };
