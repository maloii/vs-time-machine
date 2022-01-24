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
import { observer } from 'mobx-react';
import { story } from '@/story/story';

interface IProps {
    report: IReport;
    rounds: IRound[];
    teams: ITeam[];
    sportsmen: ISportsman[];
}

export const CountLapsReport: FC<IProps> = observer(({ report, rounds, teams, sportsmen }: IProps) => {
    const [rows, setRows] = useState<Array<ICountLapsReportRow>>([]);

    useEffect(() => {
        calculateCountLapsReport(report, rounds, teams, sportsmen).then(setRows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [report, report.typeRound, rounds, sportsmen, teams, story.laps]);

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
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{row.count}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{row.gap ? row.gap : '-'}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{row.rel ? row.rel : '-'}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>
                                {row.minLap ? millisecondsToTimeString(row.minLap) : '--:--:---'}
                            </TableCell>
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
});
