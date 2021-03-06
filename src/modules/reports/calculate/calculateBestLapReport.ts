import { IBestLapReportRow } from '@/types/IBestLapReportRow';
import _ from 'lodash';
import { TypeRoundReport } from '@/types/TypeRoundReport';
import { loadLapsForRoundsAction } from '@/actions/actionLapRequest';
import { ILap } from '@/types/ILap';
import { TypeLap } from '@/types/TypeLap';
import { IReport } from '@/types/IReport';
import { IRound } from '@/types/IRound';
import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';

export const calculateBestLapReport = async (
    report: IReport,
    rounds: IRound[],
    teams: ITeam[],
    sportsmen: ISportsman[]
): Promise<Array<IBestLapReportRow>> => {
    const reportRounds = rounds.filter((round) =>
        report.typeRound !== TypeRoundReport.ALL ? round.typeRound.toString() === report.typeRound.toString() : true
    );
    const allLaps = await loadLapsForRoundsAction(reportRounds);
    let resRows = _.chain(allLaps)
        .groupBy(report.onlySportsmen ? 'sportsmanId' : 'memberGroupId')
        .map((laps: ILap[], memberGroupId: string) => {
            const okLaps = laps.filter((lap) => lap.typeLap === TypeLap.OK);
            const minLap = _.minBy(okLaps, 'timeLap');
            const average = Number((_.sumBy(okLaps, 'timeLap') / okLaps.length).toFixed(0));
            return {
                memberGroupId,
                team: _.find(teams, ['_id', memberGroupId]),
                sportsman: _.find(sportsmen, ['_id', memberGroupId]),
                timeLap: minLap?.timeLap || 0,
                average
            };
        })
        .filter((item) => Boolean(item.timeLap))
        .sortBy('timeLap')
        .value();
    if (resRows.length > 0) {
        resRows = resRows.map((row, indx) => ({
            ...row,
            rel: indx > 0 ? row.timeLap - resRows[indx - 1].timeLap : undefined,
            gap: indx > 0 ? row.timeLap - resRows[0].timeLap : undefined
        }));
    }

    if (report.count) {
        return resRows.slice(0, report.count);
    }
    return resRows;
};
