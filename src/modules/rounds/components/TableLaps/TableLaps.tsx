import React, { FC } from 'react';
import { IGroup } from '@/types/IGroup';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { sportsmanName } from '@/utils/sportsmanName';
import { story } from '@/story/story';
import { observer } from 'mobx-react';

import styles from './styles.module.scss';

interface IProps {
    group: IGroup;
}

export const TableLaps: FC<IProps> = observer(({ group }: IProps) => {
    return (
        <TableContainer component={Paper} variant="outlined" className={styles.root}>
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
                    {story.laps.map((lap) => (
                        <TableRow key={lap._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
});
