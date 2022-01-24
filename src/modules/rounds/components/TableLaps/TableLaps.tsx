import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { observer } from 'mobx-react';
import { IGroup } from '@/types/IGroup';
import { TypeLap } from '@/types/TypeLap';
import { IRound } from '@/types/IRound';
import { ISportsman } from '@/types/ISportsman';
import { ILap } from '@/types/ILap';
import {
    Badge,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ListIcon from '@mui/icons-material/List';
import ConstructionIcon from '@mui/icons-material/Construction';
import { sportsmanName } from '@/utils/sportsmanName';
import { story } from '@/story/story';
import { millisecondsToTimeString } from '@/utils/millisecondsToTimeString';
import { ListAllLaps } from '@/modules/rounds/components/ListAllLaps/ListAllLaps';
import { lapDeleteAction, lapInsertAction, lapUpdateAction, loadLapsForGroupAction } from '@/actions/actionLapRequest';
import { beep } from '@/utils/beep';
import { TypeRaceStatus } from '@/types/TypeRaceStatus';
import { matrixLapsWithPitStop } from '@/utils/matrixLapsWithPitStop';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import styles from './styles.module.scss';

interface IProps {
    round: IRound;
    group: IGroup;
    readonly?: boolean;
    raceStatus?: TypeRaceStatus;
    onChangePosition?: (id: string) => void;
}

export const TableLaps: FC<IProps> = observer(({ round, group, readonly, raceStatus, onChangePosition }: IProps) => {
    const [openLapsMember, setOpenLapsMember] = useState<string | undefined>(undefined);
    const refTableContainer = useRef<HTMLDivElement>(null);
    const laps = matrixLapsWithPitStop(
        window.api.groupLapsByMemberGroup(_.cloneDeep(group), _.cloneDeep(story.laps), true)
    );
    const maxCountLap = [...group.sportsmen, ...group.teams].reduce(
        (count, item) => (laps[item._id].length > count ? laps[item._id].length : count),
        0
    );

    let numLap = 0;
    const isLap = useCallback(
        (indx: number): boolean =>
            Object.keys(laps).reduce<boolean>(
                (res, item) => res && (!laps[item]?.[indx] || laps[item]?.[indx]?.typeLap === TypeLap.OK),
                true
            ),
        [laps]
    );
    const getPositionLap = useCallback(
        (indx: number): number | undefined => {
            if (isLap(indx)) {
                numLap++;
                return numLap;
            }
            return undefined;
        },
        [isLap, numLap]
    );

    const Cell: FC<{ memberGroupId: string; indx: number }> = ({
        memberGroupId,
        indx
    }: {
        memberGroupId: string;
        indx: number;
    }) => {
        const lap = laps[memberGroupId][indx];
        const minLap = _.minBy<ILap | undefined>(
            laps[memberGroupId]?.filter((item: ILap | undefined) => !!item && item.typeLap === TypeLap.OK),
            'timeLap'
        );
        let textLap = '';
        if (lap?.typeLap === TypeLap.START) textLap = 'Start';
        if (lap?.typeLap && [TypeLap.OK, TypeLap.PIT_STOP_END].includes(lap.typeLap))
            textLap = millisecondsToTimeString(lap.timeLap);
        if (minLap && lap && minLap.timeLap === lap.timeLap)
            return (
                <TableCell>
                    <b>{textLap}</b>
                </TableCell>
            );
        return (
            <TableCell>
                {lap?.typeLap === TypeLap.PIT_STOP_END ? (
                    <div className={styles.pitStop}>
                        {lap?.typeLap === TypeLap.PIT_STOP_END && <ConstructionIcon sx={{ fontSize: 16 }} />}
                        {textLap}
                    </div>
                ) : (
                    textLap
                )}
            </TableCell>
        );
    };

    const membersGroup = useMemo(() => [...group.sportsmen, ...group.teams], [group.sportsmen, group.teams]);
    // Под вопросом, нужна ли сортировка группы по позиции.
    // .sort(
    //     (g1, g2) => (g1.position || 9999) - (g2.position || 9999)
    // );

    const handleOpenAllLaps = useCallback((id: string) => () => setOpenLapsMember(id), []);

    const handleCloseAllLaps = useCallback(() => {
        setOpenLapsMember(undefined);
    }, []);

    const handleDeleteLap = useCallback((id: string) => lapDeleteAction(id), []);
    const handleUpdateLap = useCallback(
        (id: string, lap: Pick<ILap, 'typeLap' | 'gateId' | 'timeLap'>) => lapUpdateAction(id, lap),
        []
    );
    const handleAddLap = useCallback(
        (
            memberGroupId: string,
            lap: Pick<ILap, 'typeLap' | 'gateId' | 'timeLap'>,
            beforeLap?: ILap,
            afterLap?: ILap
        ) => {
            const sportsman = _.find(group.sportsmen, ['_id', memberGroupId]);
            const team = _.find(group.teams, ['_id', memberGroupId]);
            let millisecond = DateTime.now().toMillis();
            if (beforeLap) {
                millisecond = beforeLap.millisecond - lap.timeLap;
            } else if (afterLap) {
                millisecond = afterLap.millisecond + lap.timeLap;
            }
            const sportsmanId = (sportsman ? sportsman?.sportsman?._id : team?.team?.sportsmenIds?.[0]) || '';
            const newLap = {
                ...lap,
                millisecond,
                competitionId: story?.competition?._id!,
                roundId: round._id,
                groupId: group._id,
                memberGroupId,
                sportsmanId,
                transponder: 'missing'
            };
            lapInsertAction(newLap);
        },
        [group._id, group.sportsmen, group.teams, round._id]
    );

    const handleChangePosition = useCallback(
        () => onChangePosition && onChangePosition(group._id),
        [onChangePosition, group]
    );

    const handleCopyGroupLaps = useCallback(() => {
        //laps
        const textGroupLaps = membersGroup
            .map((item) => {
                let nLap = 0;
                return (
                    item.team?.name ||
                    sportsmanName(item?.sportsman!) +
                        '\n' +
                        laps?.[item._id]
                            ?.map((lap, index) => {
                                if (!lap?.timeLap) return undefined;
                                let stringLap = '';
                                if (isLap(index)) {
                                    nLap++;
                                    stringLap = `  ${nLap} - `;
                                }
                                if (lap?.typeLap === TypeLap.PIT_STOP_END) {
                                    stringLap = '  🛠 - ';
                                }
                                stringLap += millisecondsToTimeString(lap?.timeLap);
                                return stringLap;
                            })
                            .filter((item) => item !== undefined)
                            .join('\n')
                );
            })
            .join('\n');
        navigator.clipboard.writeText(textGroupLaps).then(() => alert('Group laps copied to clipboard.'));
    }, [isLap, laps, membersGroup]);

    useEffect(() => {
        if (group) loadLapsForGroupAction(group);
        window.api.ipcRenderer.removeAllListeners('new-lap-update');
        window.api.ipcRenderer.on('new-lap-update', (e: any, newLap: ILap) => {
            loadLapsForGroupAction(group);
            if ([TypeLap.OK, TypeLap.START, TypeLap.PIT_STOP_END, TypeLap.PIT_STOP_BEGIN].includes(newLap.typeLap)) {
                beep(20, 1000, 1, 'sine');
            }
            setTimeout(() => {
                if (refTableContainer.current) {
                    refTableContainer.current.scrollTop = refTableContainer.current.scrollHeight;
                }
            }, 1);
        });
    }, [group]);

    const countLapsForMember = (id: string) =>
        ((story.laps || []).filter((lap: ILap) => lap.memberGroupId === id) || []).length;

    return (
        <TableContainer component={Paper} variant="outlined" className={styles.root} ref={refTableContainer}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Lap</TableCell>
                        {membersGroup.map((item) => (
                            <TableCell key={item._id} className={cn({ [styles.searched]: item?.searchTransponder })}>
                                <div className={styles.header}>
                                    <div>
                                        {item.sportsman ? (
                                            <b>{`${sportsmanName(item?.sportsman!, readonly)}${
                                                readonly ? '' : ` - ${(item?.sportsman?.transponders || []).join(',')}`
                                            }`}</b>
                                        ) : (
                                            <Tooltip
                                                title={
                                                    <>
                                                        {item.team?.sportsmen
                                                            ?.filter((sportsman: ISportsman) => !!sportsman)
                                                            ?.map((sportsman: ISportsman) => (
                                                                <div
                                                                    key={sportsman._id}
                                                                    className={cn({
                                                                        [styles.searchedTeamSportsmen]: (
                                                                            item.searchTeamSportsmenIds || []
                                                                        ).includes(sportsman._id)
                                                                    })}
                                                                >
                                                                    {`${sportsmanName(sportsman)}${
                                                                        readonly
                                                                            ? ''
                                                                            : ` - ${(sportsman.transponders || []).join(
                                                                                  ','
                                                                              )}`
                                                                    }`}
                                                                </div>
                                                            ))}
                                                    </>
                                                }
                                                arrow
                                            >
                                                <b>{item?.team?.name}</b>
                                            </Tooltip>
                                        )}
                                    </div>
                                    {!readonly && (
                                        <IconButton onClick={handleOpenAllLaps(item._id)}>
                                            <Badge badgeContent={countLapsForMember(item._id)} color="secondary">
                                                <ListIcon />
                                            </Badge>
                                        </IconButton>
                                    )}
                                </div>
                            </TableCell>
                        ))}
                        {!readonly && (
                            <TableCell>
                                <Tooltip title="Copy group laps">
                                    <IconButton onClick={handleCopyGroupLaps}>
                                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array(maxCountLap)
                        .fill(0)
                        .map((_, indx) => (
                            <TableRow key={indx}>
                                <TableCell>{getPositionLap(indx) || ''}</TableCell>
                                {membersGroup.map((item) => (
                                    <Cell key={item._id} memberGroupId={item._id} indx={indx} />
                                ))}
                                {!readonly && <TableCell />}
                            </TableRow>
                        ))}
                    <TableRow>
                        <TableCell>
                            <b>Pos:</b>
                        </TableCell>
                        {membersGroup.map((item) => (
                            <TableCell key={item._id}>
                                <b>{item.position || 'DNS'}</b>
                            </TableCell>
                        ))}
                        {!readonly && (
                            <TableCell className={styles.actionPos}>
                                {onChangePosition &&
                                    (!raceStatus ||
                                        ![TypeRaceStatus.READY, TypeRaceStatus.RUN].includes(raceStatus)) && (
                                        <IconButton onClick={handleChangePosition}>
                                            <EditIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    )}
                            </TableCell>
                        )}
                    </TableRow>
                </TableBody>
            </Table>
            {!!openLapsMember && (
                <ListAllLaps
                    laps={_.sortBy(
                        (story.laps || []).filter((lap: ILap) => lap.memberGroupId === openLapsMember) || [],
                        ['millisecond']
                    )}
                    gates={story.competition?.gates}
                    sportsmen={story.sportsmen}
                    open={!!openLapsMember}
                    memberGroupId={openLapsMember}
                    onClose={handleCloseAllLaps}
                    onDelete={handleDeleteLap}
                    onUpdate={handleUpdateLap}
                    onAdd={handleAddLap}
                />
            )}
        </TableContainer>
    );
});
