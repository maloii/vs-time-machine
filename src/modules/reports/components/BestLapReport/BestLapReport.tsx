import React, { FC, useEffect, useState } from 'react';
import _ from 'lodash';
import { IReport } from '@/types/IReport';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IRound } from '@/types/IRound';
import { loadLapsForRoundsAction } from '@/actions/actionLapRequest';
import { ILap } from '@/types/ILap';
import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';
import { sportsmanName } from '@/utils/sportsmanName';
import { TypeLap } from '@/types/TypeLap';
import { millisecondsToTimeString } from '@/utils/millisecondsToTimeString';
import { TypeRoundReport } from '@/types/TypeRoundReport';

interface IRow {
    memberGroupId: string;
    team?: ITeam;
    sportsman?: ISportsman;
    timeLap: number;
    gap?: number;
    rel?: number;
    average: number;
}

interface IProps {
    report: IReport;
    rounds: IRound[];
    teams: ITeam[];
    sportsmen: ISportsman[];
}

export const BestLapReport: FC<IProps> = ({ report, rounds, teams, sportsmen }: IProps) => {
    const [rows, setRows] = useState<Array<IRow>>([]);
    useEffect(() => {
        (async () => {
            const clearRounds = _.cloneDeep(
                rounds.filter((round) =>
                    report.typeRound !== TypeRoundReport.ALL
                        ? round.typeRound.toString() === report.typeRound.toString()
                        : true
                )
            );
            const allLaps = await loadLapsForRoundsAction(clearRounds);
            let resRows = _.chain(allLaps)
                .groupBy('memberGroupId')
                .map((laps: ILap[], memberGroupId: string) => {
                    const okLaps = laps.filter((lap) => lap.typeLap === TypeLap.OK);
                    const minLap = _.minBy(okLaps, 'timeLap');
                    const average = Number((_.sumBy(okLaps, 'timeLap') / okLaps.length).toFixed(0));
                    return {
                        memberGroupId,
                        countLaps: laps.length,
                        team: _.find(teams, ['_id', memberGroupId]),
                        sportsman: _.find(sportsmen, ['_id', memberGroupId]),
                        timeLap: minLap?.timeLap || 0,
                        average
                    };
                })
                .sortBy('timeLap')
                .value();
            if (resRows.length > 0) {
                resRows = resRows.map((row, indx) => ({
                    ...row,
                    rel: indx > 0 ? row.timeLap - resRows[indx - 1].timeLap : undefined,
                    gap: indx > 0 ? row.timeLap - resRows[0].timeLap : undefined
                }));
            }
            setRows(resRows);
        })();
    }, [report.typeRound, rounds, sportsmen, teams]);
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Pos</TableCell>
                        <TableCell>Sportsman</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Gap</TableCell>
                        <TableCell>Rel.</TableCell>
                        <TableCell>Average</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, indx) => (
                        <TableRow key={row.memberGroupId}>
                            <TableCell>{indx + 1}</TableCell>
                            <TableCell>{row.sportsman ? sportsmanName(row.sportsman) : row.team?.name}</TableCell>
                            <TableCell>{millisecondsToTimeString(row.timeLap)}</TableCell>
                            <TableCell>{row.gap ? millisecondsToTimeString(row.gap) : '-'}</TableCell>
                            <TableCell>{row.rel ? millisecondsToTimeString(row.rel) : '-'}</TableCell>
                            <TableCell>{millisecondsToTimeString(row.average)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
