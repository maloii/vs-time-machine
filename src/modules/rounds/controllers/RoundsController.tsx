import React, { FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { TabRounds } from '@/modules/rounds/components/TabRounds/TabRounds';
import { story } from '@/story/story';
import { IRound } from '@/types/IRound';
import {
    groupDeleteAction,
    groupInsertAction,
    groupSelectAction,
    groupUpdateAction,
    loadGroupsAction,
    loadLapsForGroupAction,
    loadRoundsAction
} from '@/actions/actionRequest';
import { Button, Grid, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DialogFormRound } from '@/modules/rounds/components/DialogFormRound/DialogFormRound';
import { ListGroups } from '@/modules/rounds/components/ListGroups/ListGroups';
import { DialogFormGroup } from '@/modules/rounds/components/DialogFormGroup/DialogFormGroup';
import { IGroup, IMembersGroup } from '@/types/IGroup';
import { ISportsman } from '@/types/ISportsman';
import { ITeam } from '@/types/ITeam';
import { TableLaps } from '@/modules/rounds/components/TableLaps/TableLaps';

import styles from './styles.module.scss';
import {
    roundDeleteAction,
    roundInsertAction,
    roundSelectAction,
    roundUpdateAction
} from '@/actions/actionRoundRequest';

const { ipcRenderer } = window.require('electron');

export const RoundsController: FC = observer(() => {
    const [openDialogAddRound, setOpenDialogAddRound] = useState(false);
    const [openDialogEditRound, setOpenDialogEditRound] = useState(false);
    const [openDialogAddGroup, setOpenDialogAddGroup] = useState(false);
    const [openDialogEditGroup, setOpenDialogEditGroup] = useState<IGroup>();

    const sportsmen = _.sortBy(story.sportsmen, 'lastName');
    const teams = _.sortBy(story.teams, 'name');

    const rounds = [...(story.rounds || [])].sort((a, b) => a.sort - b.sort);
    const groups = [...(story.groups || [])]
        .sort((a, b) => a.sort - b.sort)
        .map((group) => ({
            ...group,
            sportsmen: group.sportsmen
                .map(
                    (item): IMembersGroup => ({
                        ...item,
                        sportsman: _.find<ISportsman>(story.sportsmen, ['_id', item._id])
                    })
                )
                .filter((item) => !!item.sportsman),
            teams: group.teams
                .map(
                    (item): IMembersGroup => ({
                        ...item,
                        team: _.find<ITeam>(story.teams, ['_id', item._id])
                    })
                )
                .filter((item) => !!item.team)
        }));

    const selectedRound = rounds.find((round) => round.selected);
    const selectedGroup = groups.find((group) => group.selected);

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

    const handleCloseDialog = useCallback(() => {
        setOpenDialogAddRound(false);
        setOpenDialogEditRound(false);
        setOpenDialogAddGroup(false);
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
        (group: Omit<IGroup, '_id' | 'roundId' | 'close' | 'sort' | 'timeStart' | 'startMillisecond'>) => {
            if (story.competition && selectedRound && group.name) {
                groupInsertAction({
                    ...group,
                    close: false,
                    roundId: selectedRound._id,
                    sort: (groups || []).length > 0 ? groups[groups.length - 1].sort + 1 : 1
                });
            }
            handleCloseDialog();
        },
        [groups, handleCloseDialog, selectedRound]
    );
    const handleEditGroup = useCallback(
        (_id: string, group: Omit<IGroup, '_id' | 'roundId' | 'close' | 'sort' | 'timeStart' | 'startMillisecond'>) => {
            if (story.competition && selectedRound && group.name && openDialogEditGroup) {
                groupUpdateAction(_id, {
                    ...group,
                    close: openDialogEditGroup.close,
                    roundId: openDialogEditGroup.roundId,
                    sort: openDialogEditGroup.sort
                });
            }
            handleCloseDialog();
        },
        [handleCloseDialog, openDialogEditGroup, selectedRound]
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

    useEffect(() => {
        ipcRenderer.removeAllListeners('round-insert-response');
        ipcRenderer.removeAllListeners('round-update-response');
        ipcRenderer.removeAllListeners('round-select-response');
        ipcRenderer.removeAllListeners('round-delete-response');
        ipcRenderer.on('round-insert-response', () => loadRoundsAction(story.competition!));
        ipcRenderer.on('round-update-response', () => loadRoundsAction(story.competition!));
        ipcRenderer.on('round-select-response', () => loadRoundsAction(story.competition!));
        ipcRenderer.on('round-delete-response', () => loadRoundsAction(story.competition!));
    }, []);

    useEffect(() => {
        if (selectedRound) {
            loadGroupsAction(selectedRound);
            ipcRenderer.removeAllListeners('group-insert-response');
            ipcRenderer.removeAllListeners('group-update-response');
            ipcRenderer.removeAllListeners('group-select-response');
            ipcRenderer.removeAllListeners('group-delete-response');
            ipcRenderer.on('group-insert-response', () => loadGroupsAction(selectedRound));
            ipcRenderer.on('group-update-response', () => loadGroupsAction(selectedRound));
            ipcRenderer.on('group-select-response', () => loadGroupsAction(selectedRound));
            ipcRenderer.on('group-delete-response', () => loadGroupsAction(selectedRound));
        }
    }, [selectedRound]);

    useEffect(() => {
        if (selectedGroup) {
            loadLapsForGroupAction(selectedGroup);
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
                    <Grid item xs={4}>
                        <div className={styles.actionGroups}>
                            <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAddGroup}>
                                Add group
                            </Button>
                        </div>
                        <ListGroups
                            groups={groups}
                            selectedGroup={selectedGroup}
                            onSelect={handleSelectGroup}
                            onDelete={handleDeleteGroup}
                            onEdit={handleOpenEditGroup}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        {selectedGroup && (
                            <div>
                                <div className={styles.actionRace}>
                                    <Paper className={styles.timer}>00:00</Paper>
                                    <Button variant="contained" color="success" className={styles.startStop}>
                                        START
                                    </Button>
                                </div>
                                <TableLaps group={selectedGroup} />
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
        </div>
    );
});
