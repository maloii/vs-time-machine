const _ = require('lodash');

const getAllTranspondersAndColorInGroup = (group) => {
    return [
        ...(group.sportsmen || [])
            .filter((membersGroup) => !membersGroup.searchTransponder)
            .flatMap((membersGroup) =>
                ((membersGroup.sportsman || {}).transponders || []).flatMap((transponder) => ({
                    color: membersGroup.color,
                    transponder
                }))
            ),
        ...(group.teams || [])
            .filter((membersGroup) => !membersGroup.searchTransponder)
            .flatMap((membersGroup) =>
                ((membersGroup.team || {}).sportsmen || [])
                    .filter((sportsman) => !!sportsman)
                    .flatMap((sportsman) =>
                        ((sportsman || {}).transponders || []).flatMap((transponder) => ({
                            color: membersGroup.color,
                            transponder
                        }))
                    )
            )
    ];
};

const getNameMemberInGroup = (memberInGroup) => {
    if (memberInGroup.sportsman)
        return `${memberInGroup.sportsman.lastName || ''} ${memberInGroup.sportsman.firstName || ''}`;
    if (memberInGroup.team) return memberInGroup.team.name || '';
    return '';
};

const getAllNameMembersInGroup = (group) => {
    return [...(group.sportsmen || []), ...(group.teams || [])]
        .filter((membersGroup) => !!membersGroup.sportsman || !!membersGroup.team)
        .flatMap(getNameMemberInGroup);
};

const clearSearchTransponderInGroup = (group) => {
    return {
        ...group,
        sportsmen: (group.sportsmen || []).map((item) => ({ ...item, searchTransponder: false })),
        teams: (group.teams || []).map((item) => ({ ...item, searchTransponder: false, searchTeamSportsmenIds: [] }))
    };
};

const searchAndMarkTransponderInGroup = (group, transponder) => {
    return {
        ...group,
        sportsmen: (group.sportsmen || []).map((membersGroup) => {
            if (membersGroup.sportsman && ((membersGroup.sportsman || {}).transponders || []).includes(transponder)) {
                return { ...membersGroup, searchTransponder: true };
            }
            return membersGroup;
        }),
        teams: (group.teams || []).map((membersGroup) => {
            const sportsmenInTeam = ((membersGroup.team || {}).sportsmen || []).filter((item) => !!item);
            const sportsman = _.find(sportsmenInTeam, (item) => (item.transponders || []).includes(transponder));

            if (sportsman) {
                const searchTeamSportsmenIds = [...(membersGroup.searchTeamSportsmenIds || []), sportsman._id];
                const allSportsmenIds = sportsmenInTeam.map((item) => item._id);
                const searchTransponder = allSportsmenIds.every((val) => searchTeamSportsmenIds.includes(val));
                return { ...membersGroup, searchTeamSportsmenIds, searchTransponder };
            }
            return membersGroup;
        })
    };
};

const isAllSearchedTransponderInGroup = (group) => {
    return (
        (group.sportsmen || []).reduce((res, item) => res && item.searchTransponder, true) &&
        (group.teams || []).reduce((res, item) => res && item.searchTransponder, true)
    );
};

const findMembersGroupByTransponder = (group, transponder) => {
    const sportsmanMembersGroup = _.find(
        group.sportsmen || [],
        (membersGroup) =>
            membersGroup.sportsman && ((membersGroup.sportsman || {}).transponders || []).includes(transponder)
    );
    if (sportsmanMembersGroup) return { ...sportsmanMembersGroup, sportsmenId: sportsmanMembersGroup.sportsman._id };

    const teamMembersGroup = _.find(group.teams || [], (membersGroup) => {
        const sportsmenInTeam = ((membersGroup.team || {}).sportsmen || []).filter((item) => !!item);
        return !!_.find(sportsmenInTeam, (item) => (item.transponders || []).includes(transponder));
    });
    if (teamMembersGroup) return teamMembersGroup;
    return undefined;
};

const findInMembersGroupSportsmanByTransponder = (membersGroup, transponder) => {
    if (membersGroup?.sportsman) return membersGroup.sportsman;
    if (membersGroup?.team) {
        const sportsmenInTeam = ((membersGroup.team || {}).sportsmen || []).filter((item) => !!item);
        return _.find(sportsmenInTeam, (item) => (item.transponders || []).includes(transponder));
    }
    return undefined;
};

module.exports = {
    getAllTranspondersAndColorInGroup,
    clearSearchTransponderInGroup,
    searchAndMarkTransponderInGroup,
    isAllSearchedTransponderInGroup,
    findMembersGroupByTransponder,
    findInMembersGroupSportsmanByTransponder,
    getAllNameMembersInGroup,
    getNameMemberInGroup
};
