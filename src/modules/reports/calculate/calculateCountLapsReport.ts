import { IReport } from '@/types/IReport';
import { IRound } from '@/types/IRound';
import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';
import { ICountLapsReportRow } from '@/types/ICountLapsReportRow';
import { TypeRoundReport } from '@/types/TypeRoundReport';
import { loadLapsForRoundsAction } from '@/actions/actionLapRequest';
import _ from 'lodash';
import { ILap } from '@/types/ILap';
import { TypeLap } from '@/types/TypeLap';
import { loadGroupsByRoundsAction } from '@/actions/actionGroupRequest';

export const calculateCountLapsReport = async (
    report: IReport,
    rounds: IRound[],
    teams: ITeam[],
    sportsmen: ISportsman[]
): Promise<Array<ICountLapsReportRow>> => {
    const reportRounds = rounds.filter((round) =>
        report.typeRound !== TypeRoundReport.ALL ? round.typeRound.toString() === report.typeRound.toString() : true
    );
    const allLaps = await loadLapsForRoundsAction(reportRounds);
    const allGroups = await loadGroupsByRoundsAction(reportRounds);
    let resRows = _.chain([...sportsmen, ...teams].map((item) => item._id))
        .map((memberGroupId) => {
            let okLaps = allLaps.filter((lap) => lap.memberGroupId === memberGroupId && lap.typeLap === TypeLap.OK);
            const allGroupsForMemberId = allGroups.filter(
                (group) =>
                    [
                        ...group.sportsmen.map((sportsman) => sportsman._id),
                        ...group.teams.map((team) => team._id)
                    ].includes(memberGroupId) && Boolean(group.timeStart)
            );
            const groupedByGroupIdLaps: Record<string, ILap[]> = allGroupsForMemberId.reduce(
                (res, group) => ({ ...res, [group._id]: okLaps.filter((lap) => lap.groupId === group._id) }),
                {}
            );

            if (Object.keys(groupedByGroupIdLaps).length - (report?.notCountedRounds || 0) > 0) {
                const sortedGroupedByGroupIdLaps = _.orderBy(
                    Object.values(groupedByGroupIdLaps).map((lapsInGroup) => {
                        const minLap = _.minBy(lapsInGroup, 'timeLap');
                        return { laps: lapsInGroup, count: lapsInGroup.length, minLap };
                    }),
                    ['count', 'minLap'],
                    ['asc', 'desc']
                );
                sortedGroupedByGroupIdLaps.splice(0, report?.notCountedRounds || 0);
                okLaps = sortedGroupedByGroupIdLaps.flatMap((lapsInGroup) => lapsInGroup.laps);
            }

            const minLap = _.minBy(okLaps, 'timeLap');
            return {
                memberGroupId,
                count: okLaps.length,
                minLap: minLap?.timeLap || 0,
                team: _.find(teams, ['_id', memberGroupId]),
                sportsman: _.find(sportsmen, ['_id', memberGroupId])
            };
        })
        .orderBy(['count', 'minLap'], ['desc', 'asc'])
        .value();
    if (resRows.length > 0) {
        resRows = resRows.map((row, indx) => ({
            ...row,
            rel: indx > 0 ? resRows[indx - 1].count - row.count : undefined,
            gap: indx > 0 ? resRows[0].count - row.count : undefined
        }));
    }

    if (report.count) {
        return resRows.slice(0, report.count);
    }
    return resRows;
};
