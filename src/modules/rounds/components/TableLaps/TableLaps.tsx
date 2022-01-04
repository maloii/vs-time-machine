import React, { FC } from 'react';
import { IGroup } from '@/types/IGroup';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { sportsmanName } from '@/utils/sportsmanName';
import { story } from '@/story/story';
import { observer } from 'mobx-react';

import styles from './styles.module.scss';
import cn from 'classnames';
import { ChannelFrequencies } from '@/types/VTXChannel';

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
                            <TableCell key={item._id} className={cn({ [styles.searched]: item?.searchTransponder })}>
                                <b>{sportsmanName(item?.sportsman!)}</b>
                            </TableCell>
                        ))}
                        {group.teams.map((item) => (
                            <TableCell key={item._id} className={cn({ [styles.searched]: item?.searchTransponder })}>
                                <Tooltip
                                    title={
                                        item.team?.sportsmen
                                            ?.filter((sportsman) => !!sportsman)
                                            ?.map((sportsman) => sportsmanName(sportsman))
                                            .join(',') || ''
                                    }
                                    arrow
                                >
                                    <b>{item?.team?.name}</b>
                                </Tooltip>
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
