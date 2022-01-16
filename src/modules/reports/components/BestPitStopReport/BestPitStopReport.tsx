import React, { FC, useEffect, useState } from 'react';
import { IReport } from '@/types/IReport';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IRound } from '@/types/IRound';
import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';
import { sportsmanName } from '@/utils/sportsmanName';
import { millisecondsToTimeString } from '@/utils/millisecondsToTimeString';
import { calculateBestLPitStopReport } from '@/modules/reports/calculate/calculateBestLPitStopReport';
import { IBestLapReportRow } from '@/types/IBestLapReportRow';

interface IProps {
    report: IReport;
    rounds: IRound[];
    teams: ITeam[];
    sportsmen: ISportsman[];
}

export const BestPitStopReport: FC<IProps> = ({ report, rounds, teams, sportsmen }: IProps) => {
    const [rows, setRows] = useState<Array<IBestLapReportRow>>([]);

    useEffect(() => {
        calculateBestLPitStopReport(report, rounds, teams, sportsmen).then(setRows);
    }, [report, report.typeRound, rounds, sportsmen, teams]);

    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Pos.</TableCell>
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
                            <TableCell>{row.timeLap ? millisecondsToTimeString(row.timeLap) : '--:--:---'}</TableCell>
                            <TableCell>{row.gap ? millisecondsToTimeString(row.gap) : '-'}</TableCell>
                            <TableCell>{row.rel ? millisecondsToTimeString(row.rel) : '-'}</TableCell>
                            <TableCell>{row.average ? millisecondsToTimeString(row.average) : '--:--:---'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <tfoot>
                    <tr>
                        <td colSpan={6}>
                            <div />
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </TableContainer>
    );
};
