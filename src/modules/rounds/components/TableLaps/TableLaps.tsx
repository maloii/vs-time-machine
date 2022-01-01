import React, { FC } from 'react';
import { IGroup } from '@/types/IGroup';
import { ILap } from '@/types/ILap';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { sportsmanName } from '@/utils/sportsmanName';

interface IProps {
    group: IGroup;
    laps: ILap[];
}

export const TableLaps: FC<IProps> = ({ group, laps }: IProps) => {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Lap</TableCell>
                        {group.sportsmen.map((item) => (
                            <TableCell key={item._id}>
                                <b>{sportsmanName(item?.sportsman!)}</b>
                            </TableCell>
                        ))}
                        {group.teams.map((item) => (
                            <TableCell key={item._id}>
                                <b>{item?.team?.name}</b>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {laps.map((lap) => (
                        <TableRow key={lap._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
