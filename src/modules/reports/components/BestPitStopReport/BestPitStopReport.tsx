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
import { observer } from 'mobx-react';
import { story } from '@/story/story';

interface IProps {
    report: IReport;
    rounds: IRound[];
    teams: ITeam[];
    sportsmen: ISportsman[];
}

export const BestPitStopReport: FC<IProps> = observer(({ report, rounds, teams, sportsmen }: IProps) => {
    const [rows, setRows] = useState<Array<IBestLapReportRow>>([]);

    useEffect(() => {
        calculateBestLPitStopReport(report, rounds, teams, sportsmen).then(setRows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [report, report.typeRound, rounds, sportsmen, teams, story.laps]);

    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Pos.</TableCell>
                        <TableCell>Sportsman</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Gap</TableCell>
                        {!report.simplified && <TableCell>Rel.</TableCell>}
                        {!report.simplified && <TableCell>Average</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, indx) => (
                        <TableRow key={row.memberGroupId}>
                            <TableCell>{indx + 1}</TableCell>
                            <TableCell>
                                {row.sportsman ? sportsmanName(row.sportsman, report.simplified) : row.team?.name}
                            </TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>
                                {row.timeLap ? millisecondsToTimeString(row.timeLap) : '--:--:---'}
                            </TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>
                                {row.gap ? millisecondsToTimeString(row.gap) : '-'}
                            </TableCell>
                            {!report.simplified && (
                                <TableCell style={{ whiteSpace: 'nowrap' }}>
                                    {row.rel ? millisecondsToTimeString(row.rel) : '-'}
                                </TableCell>
                            )}
                            {!report.simplified && (
                                <TableCell style={{ whiteSpace: 'nowrap' }}>
                                    {row.average ? millisecondsToTimeString(row.average) : '--:--:---'}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
});
