import React, { FC, useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { sportsmanName } from '@/utils/sportsmanName';
import { millisecondsToTimeString } from '@/utils/millisecondsToTimeString';
import { IReport } from '@/types/IReport';
import { IRound } from '@/types/IRound';
import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';
import { ICountLapsReportRow } from '@/types/ICountLapsReportRow';
import { calculateCountLapsReport } from '@/modules/reports/calculate/calculateCountLapsReport';

interface IProps {
    report: IReport;
    rounds: IRound[];
    teams: ITeam[];
    sportsmen: ISportsman[];
}

export const CountLapsReport: FC<IProps> = ({ report, rounds, teams, sportsmen }: IProps) => {
    const [rows, setRows] = useState<Array<ICountLapsReportRow>>([]);

    useEffect(() => {
        calculateCountLapsReport(report, rounds, teams, sportsmen).then(setRows);
    }, [report, report.typeRound, rounds, sportsmen, teams]);

    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Pos.</TableCell>
                        <TableCell>Sportsman</TableCell>
                        <TableCell>Laps</TableCell>
                        <TableCell>Gap</TableCell>
                        <TableCell>Rel.</TableCell>
                        <TableCell>Min. Lap</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, indx) => (
                        <TableRow key={row.memberGroupId}>
                            <TableCell>{indx + 1}</TableCell>
                            <TableCell>{row.sportsman ? sportsmanName(row.sportsman) : row.team?.name}</TableCell>
                            <TableCell>{row.count}</TableCell>
                            <TableCell>{row.gap ? row.gap : '-'}</TableCell>
                            <TableCell>{row.rel ? row.rel : '-'}</TableCell>
                            <TableCell>{millisecondsToTimeString(row.minLap)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
