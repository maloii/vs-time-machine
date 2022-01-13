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
    let resRows = _.chain(allLaps)
        .groupBy('memberGroupId')
        .map((laps: ILap[], memberGroupId: string) => {
            let okLaps = laps.filter((lap) => lap.typeLap === TypeLap.OK);
            const groupedByGroupIdLaps = _.groupBy(okLaps, 'groupId');
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
    return resRows;
};
