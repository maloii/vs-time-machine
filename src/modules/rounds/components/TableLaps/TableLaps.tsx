import React, { FC } from 'react';
import _ from 'lodash';
import cn from 'classnames';
import { IGroup } from '@/types/IGroup';
import { ILap } from '@/types/ILap';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { sportsmanName } from '@/utils/sportsmanName';
import { story } from '@/story/story';
import { observer } from 'mobx-react';

import styles from './styles.module.scss';
import { TypeLap } from '@/types/TypeLap';
import { millisecondsToTimeString } from '@/utils/millisecondsToTimeString';

interface IProps {
    group: IGroup;
}

export const TableLaps: FC<IProps> = observer(({ group }: IProps) => {
    const laps: Record<string, ILap[]> = {};
    [...group.sportsmen, ...group.teams].forEach((item) => {
        laps[item._id] = _.sortBy(
            (story.laps || []).filter(
                (lap) => lap.memberGroupId === item._id && [TypeLap.START, TypeLap.OK].includes(lap.typeLap)
            ),
            ['millisecond']
        );
    });
    const maxCountLap = [...group.sportsmen, ...group.teams].reduce(
        (count, item) => (laps[item._id].length > count ? laps[item._id].length : count),
        0
    );

    const Cell: FC<{ memberGroupId: string; indx: number }> = ({
        memberGroupId,
        indx
    }: {
        memberGroupId: string;
        indx: number;
    }) => {
        const lap = laps[memberGroupId][indx];
        let textLap = '';
        if (lap?.typeLap === TypeLap.START) textLap = 'Start';
        if (lap?.typeLap === TypeLap.OK) textLap = millisecondsToTimeString(lap.timeLap);
        return <TableCell>{textLap}</TableCell>;
    };

    return (
        <TableContainer component={Paper} variant="outlined" className={styles.root}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Lap</TableCell>
                        {group.sportsmen.map((item) => (
                            <TableCell key={item._id} className={cn({ [styles.searched]: item?.searchTransponder })}>
                                <b>{`${sportsmanName(item?.sportsman!)} - ${(item?.sportsman?.transponders || []).join(
                                    ','
                                )}`}</b>
                            </TableCell>
                        ))}
                        {group.teams.map((item) => (
                            <TableCell key={item._id} className={cn({ [styles.searched]: item?.searchTransponder })}>
                                <Tooltip
                                    title={
                                        <>
                                            {item.team?.sportsmen
                                                ?.filter((sportsman) => !!sportsman)
                                                ?.map((sportsman) => (
                                                    <div
                                                        key={sportsman._id}
                                                        className={cn({
                                                            [styles.searchedTeamSportsmen]: (
                                                                item.searchTeamSportsmenIds || []
                                                            ).includes(sportsman._id)
                                                        })}
                                                    >
                                                        {`${sportsmanName(sportsman)} - ${(
                                                            sportsman.transponders || []
                                                        ).join(',')}`}
                                                    </div>
                                                ))}
                                        </>
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
                    {Array(maxCountLap)
                        .fill(0)
                        .map((_, indx) => (
                            <TableRow key={indx}>
                                <TableCell>{indx + 1}</TableCell>
                                {[...group.sportsmen, ...group.teams].map((item) => (
                                    <Cell key={item._id} memberGroupId={item._id} indx={indx} />
                                ))}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
});
