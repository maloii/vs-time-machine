import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { story } from '@/story/story';

import { IRound } from '@/types/IRound';
import { TypeRaceStatus } from '@/types/TypeRaceStatus';
import { IGroup } from '@/types/IGroup';
import { ColorCss } from '@/types/Color';
import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';

import {
    groupDeleteAction,
    groupInsertAction,
    groupSelectAction,
    groupUpdateAction,
    loadLapsForGroupAction,
    sportsmanUpdateAction,
    teamUpdateAction
} from '@/actions/actionRequest';
import {
    roundDeleteAction,
    roundInsertAction,
    roundSelectAction,
    roundUpdateAction
} from '@/actions/actionRoundRequest';
import { invitationRaceAction, startRaceAction, startSearchAction, stopRaceAction } from '@/actions/actionRaceRequest';
import { DialogFormRound } from '@/modules/rounds/components/DialogFormRound/DialogFormRound';
import { ListGroups } from '@/modules/rounds/components/ListGroups/ListGroups';
import { DialogFormGroup } from '@/modules/rounds/components/DialogFormGroup/DialogFormGroup';
import { TableLaps } from '@/modules/rounds/components/TableLaps/TableLaps';
import { StopWatch } from '@/modules/rounds/components/StopWatch/StopWatch';
import { TabRounds } from '@/modules/rounds/components/TabRounds/TabRounds';
import { DialogChangePositionsInGroup } from '@/modules/rounds/components/DialogChangePositionsInGroup/DialogChangePositionsInGroup';
import { DVRVideo } from '@/modules/rounds/components/DVRVideo/DVRVideo';

import { sportsmanName } from '@/utils/sportsmanName';

import styles from './styles.module.scss';
import { DialogSportsmanEdit } from '@/modules/sportsmen/components/DialogSportsmanEdit/DialogSportsmanEdit';
import { DialogTeamEdit } from '@/modules/sportsmen/components/DialogTeamEdit/DialogTeamEdit';
import { computed } from 'mobx';

export const RoundsContainer: FC = observer(() => {
    const [openDialogAddRound, setOpenDialogAddRound] = useState(false);
    const [openDialogEditRound, setOpenDialogEditRound] = useState(false);
    const [openDialogAddGroup, setOpenDialogAddGroup] = useState(false);
    const [openDialogEditGroup, setOpenDialogEditGroup] = useState<IGroup>();
    const [openDialogChangePositions, setOpenDialogChangePositions] = useState<IGroup>();
    const [videoCurrentTime, setVideoCurrentTime] = useState<number>();
    const [openDialogEditSportsman, setOpenDialogEditSportsman] = useState(false);
    const [openDialogEditTeam, setOpenDialogEditTeam] = useState(false);
    const [sportsmanEdit, setSportsmanEdit] = useState<ISportsman>();
    const [teamEdit, setTeamEdit] = useState<ITeam>();

    const sportsmen = useMemo(() => computed(() => _.sortBy(story.sportsmen, 'lastName')), []).get();
    const teams = useMemo(() => computed(() => _.sortBy(story.teams, 'name')), []).get();

    const rounds = useMemo(() => computed(() => [...(story.rounds || [])].sort((a, b) => a.sort - b.sort)), []).get();
    const groups = useMemo(() => computed(() => [...(story.groups || [])]), []).get();

    const selectedRound = useMemo(() => rounds.find((round) => round.selected), [rounds]);
    const selectedGroup = useMemo(() => groups.find((group) => group.selected), [groups]);
    const raceReadyToStart = !story.raceStatus || story.raceStatus === TypeRaceStatus.STOP;

    const handleSelectRound = useCallback(async (_id: string) => {
        if (story.competition) {
            roundSelectAction(story.competition._id, _id);
        }
    }, []);

    const handleOpenAddRound = useCallback(() => setOpenDialogAddRound(true), []);
    const handleOpenEditRound = useCallback(() => setOpenDialogEditRound(true), []);
    const handleOpenAddGroup = useCallback(() => setOpenDialogAddGroup(true), []);

    const handleOpenEditGroup = useCallback(
        (id: string) => {
            setOpenDialogEditGroup(_.find(groups, ['_id', id]));
        },
        [groups]
    );
    const handleOpenChangePositions = useCallback(
        (id: string) => {
            setOpenDialogChangePositions(_.find(groups, ['_id', id]));
        },
        [groups]
    );

    const handleSelectVideoCurrentTime = useCallback((currentTime: number) => {
        setVideoCurrentTime(currentTime);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialogAddRound(false);
        setOpenDialogEditRound(false);
        setOpenDialogAddGroup(false);
        setOpenDialogChangePositions(undefined);
        setOpenDialogEditGroup(undefined);
    }, []);

    const handleAddRound = useCallback(
        async (
            round: Omit<IRound, '_id' | 'competitionId' | 'selected' | 'dateCreate' | 'minTimeLap' | 'close' | 'sort'>
        ) => {
            if (story.competition && round.name) {
                roundInsertAction(story.competition._id, round);
                handleCloseDialog();
            }
        },
        [handleCloseDialog]
    );

    const handleEditRound = useCallback(
        async (
            round: Omit<IRound, '_id' | 'competitionId' | 'selected' | 'dateCreate' | 'minTimeLap' | 'close' | 'sort'>
        ) => {
            if (story.competition && selectedRound && round.name) {
                roundUpdateAction(selectedRound._id, round);
                handleCloseDialog();
            }
        },
        [selectedRound, handleCloseDialog]
    );

    const handleDeleteRound = useCallback(
        async (_id: string) => {
            if (
                story.competition &&
                window.confirm(
                    'Are you sure you want to delete the round? All groups and laps will be deleted with him!'
                )
            ) {
                roundDeleteAction(_id);
                handleCloseDialog();
            }
        },
        [handleCloseDialog]
    );

    const handleAddGroup = useCallback(
        (group: Omit<IGroup, '_id' | 'competitionId' | 'roundId' | 'close' | 'sort' | 'timeStart'>) => {
            if (story.competition && selectedRound && group.name) {
                groupInsertAction({
                    ...group,
                    close: false,
                    roundId: selectedRound._id,
                    competitionId: story.competition._id,
                    sort: (groups || []).length > 0 ? groups[groups.length - 1].sort + 1 : 1
                });
            }
            handleCloseDialog();
        },
        [groups, handleCloseDialog, selectedRound]
    );
    const handleEditGroup = useCallback(
        (_id: string, group: Omit<IGroup, '_id' | 'competitionId' | 'roundId' | 'close' | 'sort' | 'timeStart'>) => {
            if (story.competition && group.name) {
                groupUpdateAction(_id, group);
            }
            handleCloseDialog();
        },
        [handleCloseDialog]
    );

    const handleSelectGroup = useCallback(
        (_id: string) => {
            if (story.competition && selectedRound) {
                groupSelectAction(selectedRound._id, _id);
            }
        },
        [selectedRound]
    );

    const handleDeleteGroup = useCallback(
        (_id: string) => {
            if (
                story.competition &&
                selectedRound &&
                window.confirm('Are you sure you want to delete the group? All  laps will be deleted with him!')
            ) {
                groupDeleteAction(_id);
            }
        },
        [selectedRound]
    );

    const handleInvitationRace = useCallback(() => {
        if (selectedGroup) {
            if (raceReadyToStart) {
                invitationRaceAction({
                    ..._.cloneDeep(selectedGroup),
                    competition: _.cloneDeep(story.competition),
                    round: _.cloneDeep(selectedRound)
                });
            }
        }
    }, [raceReadyToStart, selectedGroup, selectedRound]);

    const handleStartRace = useCallback(() => {
        if (selectedGroup) {
            if (
                raceReadyToStart &&
                (story.laps?.length > 0
                    ? window.confirm('There is lap data in the group, if you restart the race it will be deleted!')
                    : true)
            ) {
                startRaceAction({
                    ..._.cloneDeep(selectedGroup),
                    competition: _.cloneDeep(story.competition),
                    round: _.cloneDeep(selectedRound)
                });
            } else {
                stopRaceAction();
            }
        }
    }, [raceReadyToStart, selectedGroup, selectedRound]);

    const handleStartSearch = useCallback(() => {
        if (selectedGroup) {
            if (raceReadyToStart) {
                startSearchAction(_.cloneDeep(selectedGroup));
            } else {
                stopRaceAction();
            }
        }
    }, [raceReadyToStart, selectedGroup]);

    const handleCopyListGroups = useCallback(() => {
        const textGroups = groups
            .map(
                (group) =>
                    group.name +
                    ':\n' +
                    [...group.sportsmen, ...group.teams]
                        .map(
                            (item) =>
                                `    ${item.startNumber || ''} - ${item.team?.name || sportsmanName(item?.sportsman!)}${
                                    item.color !== undefined ? ` ${ColorCss[item.color]}` : ''
                                }  ${item.channel}`
                        )
                        .join('\n')
            )
            .join('\n');

        navigator.clipboard.writeText(textGroups).then(() => alert('Group list copied to clipboard.'));
    }, [groups]);

    const handleOpenEditSportsman = useCallback(
        (_id: string) => {
            setSportsmanEdit(_.find(sportsmen, ['_id', _id]));
        },
        [sportsmen]
    );

    const handleOpenEditTeam = useCallback(
        (_id: string) => {
            setTeamEdit(_.find(teams, ['_id', _id]));
        },
        [teams]
    );

    const handleClose = useCallback(() => {
        setSportsmanEdit(undefined);
        setTeamEdit(undefined);
        setOpenDialogEditSportsman(false);
        setOpenDialogEditTeam(false);
    }, []);

    const handleUpdateSportsman = useCallback(
        (_id: string, sportsman: Omit<ISportsman, '_id' | 'competitionId'>) => {
            if (story.competition && _id) {
                sportsmanUpdateAction(_id, sportsman);
                handleClose();
            }
        },
        [handleClose]
    );

    const handleUpdateTeam = useCallback(
        (_id: string, team: Omit<ITeam, '_id' | 'competitionId'>) => {
            if (story.competition && _id) {
                teamUpdateAction(_id, team);
                handleClose();
            }
        },
        [handleClose]
    );

    useEffect(() => {
        if (selectedGroup) {
            loadLapsForGroupAction(selectedGroup._id);
        }
    }, [selectedGroup]);

    return (
        <div className={styles.root}>
            <TabRounds
                rounds={rounds}
                selectedId={selectedRound?._id}
                onSelect={handleSelectRound}
                onAddRound={handleOpenAddRound}
                onEditRound={handleOpenEditRound}
            />
            {(rounds || []).length === 0 && <div className={styles.empty}>No groups</div>}
            {selectedRound && (
                <Grid container spacing={2} className={styles.container}>
                    <Grid item xs={4} className={styles.groupsContainer}>
                        <div className={styles.actionGroups}>
                            <Tooltip title="Copy group list">
                                <IconButton onClick={handleCopyListGroups}>
                                    <ContentCopyIcon />
                                </IconButton>
                            </Tooltip>
                            <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAddGroup}>
                                Add group
                            </Button>
                        </div>
                        <ListGroups
                            groups={groups}
                            selectedGroup={selectedGroup}
                            groupInRace={story.groupInRace}
                            onSelect={handleSelectGroup}
                            onDelete={handleDeleteGroup}
                            onEdit={handleOpenEditGroup}
                            onUpdate={handleEditGroup}
                            competition={story.competition!}
                        />
                    </Grid>
                    <Grid item xs={8} className={styles.containerRace}>
                        {selectedGroup && (
                            <div className={styles.race}>
                                <div className={styles.actionRace}>
                                    <Button
                                        variant="contained"
                                        className={styles.startSearch}
                                        onClick={handleStartSearch}
                                        disabled={!raceReadyToStart || !story.connected}
                                    >
                                        SEARCH
                                    </Button>
                                    <StopWatch
                                        round={selectedRound}
                                        raceStatus={story.raceStatus}
                                        startTime={story.startTime}
                                    />
                                    <Button
                                        variant="contained"
                                        className={styles.invite}
                                        onClick={handleInvitationRace}
                                        disabled={!raceReadyToStart || !story.connected}
                                    >
                                        INVITE
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={raceReadyToStart ? 'success' : 'error'}
                                        className={styles.startStop}
                                        onClick={handleStartRace}
                                        disabled={!story.connected}
                                    >
                                        {raceReadyToStart ? 'START' : 'STOP'}
                                    </Button>
                                </div>
                                <TableLaps
                                    round={selectedRound}
                                    group={selectedGroup}
                                    raceStatus={story.raceStatus}
                                    groupLaps={story.laps}
                                    onChangePosition={handleOpenChangePositions}
                                    onSelectVideoCurrentTime={handleSelectVideoCurrentTime}
                                    onOpenEditSportsman={handleOpenEditSportsman}
                                    onOpenEditTeam={handleOpenEditTeam}
                                />
                                <DVRVideo
                                    key={selectedGroup?.videoSrc || selectedGroup._id}
                                    competition={story.competition!}
                                    round={selectedRound}
                                    group={selectedGroup}
                                    currentTime={videoCurrentTime}
                                />
                            </div>
                        )}
                    </Grid>
                </Grid>
            )}
            {(openDialogAddRound || openDialogEditRound) && (
                <DialogFormRound
                    open={openDialogAddRound || openDialogEditRound}
                    onClose={handleCloseDialog}
                    onSave={handleAddRound}
                    onUpdate={handleEditRound}
                    onDelete={handleDeleteRound}
                    rounds={rounds}
                    round={openDialogEditRound ? selectedRound : undefined}
                />
            )}
            {(openDialogAddGroup || openDialogEditGroup) && (
                <DialogFormGroup
                    open={openDialogAddGroup || !!openDialogEditGroup}
                    onClose={handleCloseDialog}
                    onSave={handleAddGroup}
                    onUpdate={handleEditGroup}
                    onDelete={handleDeleteGroup}
                    group={openDialogEditGroup}
                    groups={groups}
                    sportsmen={sportsmen}
                    teams={teams}
                    competition={story.competition!}
                />
            )}
            {openDialogChangePositions && (
                <DialogChangePositionsInGroup
                    open={!!openDialogChangePositions}
                    onClose={handleCloseDialog}
                    onUpdate={handleEditGroup}
                    group={openDialogChangePositions}
                />
            )}
            {(openDialogEditSportsman || !!sportsmanEdit) && (
                <DialogSportsmanEdit
                    open={openDialogEditSportsman || !!sportsmanEdit}
                    sportsman={sportsmanEdit}
                    onClose={handleClose}
                    onUpdate={handleUpdateSportsman}
                />
            )}
            {(openDialogEditTeam || !!teamEdit) && (
                <DialogTeamEdit
                    open={openDialogEditTeam || !!teamEdit}
                    team={teamEdit}
                    teams={teams}
                    sportsmen={sportsmen}
                    onClose={handleClose}
                    onUpdate={handleUpdateTeam}
                />
            )}
        </div>
    );
});
