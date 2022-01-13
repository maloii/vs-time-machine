import React, { FC, useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IReport } from '@/types/IReport';
import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';
import { calculatePositionSportsmenReport } from '@/modules/reports/calculate/calculatePositionSportsmenReport';
import { IPositionSportsmenReport } from '@/types/IPositionSportsmenReport';

interface IProps {
    report: IReport;
    teams: ITeam[];
    sportsmen: ISportsman[];
}

export const PositionSportsmenReport: FC<IProps> = ({ report, teams, sportsmen }: IProps) => {
    const [rows, setRows] = useState<Array<IPositionSportsmenReport>>([]);

    useEffect(() => {
        calculatePositionSportsmenReport(report, teams, sportsmen).then(setRows);
    }, [report, report.typeRound, sportsmen, teams]);

    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Pos.</TableCell>
                        <TableCell>Sportsman</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>Country</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, indx) => (
                        <TableRow key={row._id}>
                            <TableCell>{row.pos}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.city}</TableCell>
                            <TableCell>{row.country}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
