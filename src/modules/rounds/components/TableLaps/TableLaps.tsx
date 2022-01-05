import React, { FC } from 'react';
import cn from 'classnames';
import { IGroup } from '@/types/IGroup';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { sportsmanName } from '@/utils/sportsmanName';
import { story } from '@/story/story';
import { observer } from 'mobx-react';

import styles from './styles.module.scss';
import { TypeLap } from '@/types/TypeLap';
import { millisecondsToTimeString } from '@/utils/millisecondsToTimeString';
import { groupLapsByMemberGroup, positionCalculation } from '@/utils/positionCalculation';
import { IRound } from '@/types/IRound';

interface IProps {
    round: IRound;
    group: IGroup;
}

export const TableLaps: FC<IProps> = observer(({ round, group }: IProps) => {
    const laps = groupLapsByMemberGroup(group, story.laps);
    const groupWithPositions = positionCalculation(round, group, laps);
    const maxCountLap = [...groupWithPositions.sportsmen, ...groupWithPositions.teams].reduce(
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

    const membersGroup = [...groupWithPositions.sportsmen, ...groupWithPositions.teams].sort(
        (g1, g2) => (g1.position || 9999) - (g2.position || 9999)
    );

    return (
        <TableContainer component={Paper} variant="outlined" className={styles.root}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Lap</TableCell>
                        {membersGroup.map((item) => (
                            <TableCell key={item._id} className={cn({ [styles.searched]: item?.searchTransponder })}>
                                {item.sportsman ? (
                                    <b>{`${sportsmanName(item?.sportsman!)} - ${(
                                        item?.sportsman?.transponders || []
                                    ).join(',')}`}</b>
                                ) : (
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
                                )}
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
                                {membersGroup.map((item) => (
                                    <Cell key={item._id} memberGroupId={item._id} indx={indx} />
                                ))}
                            </TableRow>
                        ))}
                </TableBody>
                <TableRow>
                    <TableCell>Pos:</TableCell>
                    {membersGroup.map((item) => (
                        <TableCell key={item._id}>{item.position || 'n/p'}</TableCell>
                    ))}
                </TableRow>
            </Table>
        </TableContainer>
    );
});
