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

const clearSearchTransponderInGroup = (group) => {
    return {
        ...group,
        sportsmen: (group.sportsmen || []).map((item) => ({ ...item, searchTransponder: false })),
        teams: (group.teams || []).map((item) => ({ ...item, searchTransponder: false }))
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
            if (
                membersGroup.team &&
                (
                    ((membersGroup.team || {}).sportsmen || []).flatMap(
                        (sportsman) => (sportsman || {}).transponders
                    ) || []
                ).includes(transponder)
            ) {
                return { ...membersGroup, searchTransponder: true };
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

module.exports = {
    getAllTranspondersAndColorInGroup,
    clearSearchTransponderInGroup,
    searchAndMarkTransponderInGroup,
    isAllSearchedTransponderInGroup
};
