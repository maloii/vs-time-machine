import _ from 'lodash';
import { IGroup } from '@/types/IGroup';
import { ILap } from '@/types/ILap';
import { TypeLap } from '@/types/TypeLap';
import { IRound } from '@/types/IRound';
import { TypeRace } from '@/types/TypeRace';

export const positionCalculation = (round: IRound, group: IGroup, groupedLaps: Record<string, ILap[]>): IGroup => {
    let memberGroup = [...group.sportsmen, ...group.teams];
    if ([TypeRace.FIXED_TIME, TypeRace.FIXED_TIME_AND_ONE_LAP_AFTER].includes(round.typeRace)) {
        memberGroup.sort((m1, m2) => groupedLaps?.[m2._id]?.length - groupedLaps?.[m1._id]?.length);
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
                position:
                    groupedLaps[team._id]?.length > 0 ? _.findIndex(memberGroup, ['_id', team._id]) + 1 : undefined
            }))
        };
    }

    return group;
};

export const groupLapsByMemberGroup = (group: IGroup, laps: ILap[]): Record<string, ILap[]> => {
    const groupedLaps: Record<string, ILap[]> = {};
    [...group.sportsmen, ...group.teams].forEach((item) => {
        groupedLaps[item._id] = _.sortBy(
            (laps || []).filter(
                (lap) => lap.memberGroupId === item._id && [TypeLap.START, TypeLap.OK].includes(lap.typeLap)
            ),
            ['millisecond']
        );
    });
    return groupedLaps;
};
