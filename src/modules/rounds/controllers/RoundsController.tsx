import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { TabRounds } from '@/modules/rounds/components/TabRounds/TabRounds';
import { story } from '@/story/story';
import { db } from '@/repository/Repository';
import { IRound } from '@/types/IRound';
import { loadGroupsAction, loadRoundsAction } from '@/actions/loadCompetitionAction';
import { Button, Grid, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DialogFormRound } from '@/modules/rounds/components/DialogFormRound/DialogFormRound';
import { ListGroups } from '@/modules/rounds/components/ListGroups/ListGroups';

import styles from './styles.module.scss';
import { DialogFormGroup } from '@/modules/rounds/components/DialogFormGroup/DialogFormGroup';
import { IGroup } from '@/types/IGroup';
import { groupDelete, groupInsert, groupSelect } from '@/repository/GroupRepository';

export const RoundsController: FC = observer(() => {
    const [openDialogAddRound, setOpenDialogAddRound] = useState(false);
    const [openDialogEditRound, setOpenDialogEditRound] = useState(false);
    const [openDialogAddGroup, setOpenDialogAddGroup] = useState(false);
    const [openDialogEditGroup, setOpenDialogEditGroup] = useState(false);

    const rounds = [...(story.rounds || [])].sort((a, b) => a.sort - b.sort);
    const groups = [...(story.groups || [])].sort((a, b) => a.sort - b.sort);
    const sportsmen = _.sortBy(story.sportsmen, 'lastName');
    const teams = _.sortBy(story.teams, 'name');

    const selectedRound = useMemo(() => rounds.find((round) => round.selected), [rounds]);
    const selectedGroup = useMemo(() => groups.find((group) => group.selected), [groups]);

    const handleSelectRound = useCallback(async (_id: string) => {
        if (story.competition) {
            await db.round.update(
                { competitionId: story.competition._id, selected: true },
                { $set: { selected: false } },
                { multi: true }
            );
            await db.round.update({ _id }, { $set: { selected: true } });
            await loadRoundsAction(story.competition);
        }
    }, []);

    const handleOpenAddRound = useCallback(() => setOpenDialogAddRound(true), []);
    const handleOpenEditRound = useCallback(() => setOpenDialogEditRound(true), []);
    const handleOpenAddGroup = useCallback(() => setOpenDialogAddGroup(true), []);
    const handleOpenEditGroup = useCallback(() => setOpenDialogEditGroup(true), []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialogAddRound(false);
        setOpenDialogEditRound(false);
        setOpenDialogAddGroup(false);
        setOpenDialogEditGroup(false);
    }, []);

    const handleAddRound = useCallback(
        async (
            round: Omit<
                IRound,
                '_id' | 'competitionId' | 'selected' | 'dateCreate' | 'minTimeLap' | 'close' | 'sort' | 'groups'
            >
        ) => {
            if (story.competition && round.name) {
                await Promise.all(
                    rounds.map(async (item, indx) => {
                        return await db.round.update(
                            { _id: item._id },
                            {
                                $set: { selected: false, sort: indx }
                            }
                        );
                    })
                );

                await db.round.insert({
                    ...round,
                    competitionId: story.competition._id,
                    sort: rounds.length,
                    selected: true
                });
                await loadRoundsAction(story.competition);
                handleCloseDialog();
            }
        },
        [rounds, handleCloseDialog]
    );

    const handleEditRound = useCallback(
        async (
            round: Omit<
                IRound,
                '_id' | 'competitionId' | 'selected' | 'dateCreate' | 'minTimeLap' | 'close' | 'sort' | 'groups'
            >
        ) => {
            if (story.competition && selectedRound && round.name) {
                await db.round.update({ _id: selectedRound._id }, { $set: { ...round } });
                await loadRoundsAction(story.competition);
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
                await db.round.remove({ _id }, {});
                const newRounds = await loadRoundsAction(story.competition);
                if ((newRounds || []).length > 0) {
                    const newSelectedRound = newRounds[newRounds.length - 1];
                    await db.round.update({ _id: newSelectedRound._id }, { $set: { selected: true } });
                    await loadRoundsAction(story.competition);
                }
                handleCloseDialog();
            }
        },
        [handleCloseDialog]
    );

    const handleAddGroup = useCallback(
        async (group: Omit<IGroup, '_id' | 'roundId' | 'close' | 'sort' | 'timeStart' | 'startMillisecond'>) => {
            if (story.competition && selectedRound && group.name) {
                await groupInsert({
                    ...group,
                    close: false,
                    roundId: selectedRound._id,
                    sort: (groups || []).length > 0 ? groups[groups.length - 1].sort + 1 : 1
                });
                await loadGroupsAction(selectedRound);
            }
            handleCloseDialog();
        },
        [handleCloseDialog, rounds, selectedRound]
    );
    const handleEditGroup = useCallback(
        (
            _id: string,
            group: Omit<IGroup, '_id' | 'roundId' | 'close' | 'sort' | 'timeStart' | 'startMillisecond'>
        ) => {},
        []
    );

    const handleSelectGroup = useCallback(
        async (_id: string) => {
            if (story.competition && selectedRound) {
                await groupSelect(selectedRound._id, _id);
                await loadGroupsAction(selectedRound);
            }
        },
        [selectedRound]
    );

    const handleDeleteGroup = useCallback(
        async (_id: string) => {
            if (
                story.competition &&
                selectedRound &&
                window.confirm('Are you sure you want to delete the group? All  laps will be deleted with him!')
            ) {
                await groupDelete(_id);
                await loadGroupsAction(selectedRound);
            }
        },
        [selectedRound]
    );

    useEffect(() => {
        if (selectedRound) {
            loadGroupsAction(selectedRound);
        }
    }, [selectedRound]);

    return (
        <div className={styles.root}>
            <TabRounds
                rounds={rounds}
                selectedId={selectedRound?._id}
                onSelect={handleSelectRound}
                onAddRound={handleOpenAddRound}
                onEditRound={handleOpenEditRound}
            />
            <Grid container spacing={2} className={styles.container}>
                <Grid item xs={4}>
                    <div className={styles.actionGroups}>
                        <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAddGroup}>
                            Add group
                        </Button>
                    </div>
                    <ListGroups
                        groups={groups}
                        sportsmen={sportsmen}
                        teams={teams}
                        competition={story.competition!}
                        selectedGroup={selectedGroup}
                        onSelect={handleSelectGroup}
                        onDelete={handleDeleteGroup}
                        onEdit={handleOpenEditGroup}
                    />
                </Grid>
                <Grid item xs={8}>
                    <Paper elevation={0} variant="outlined">
                        <h4>Race</h4>
                    </Paper>
                </Grid>
            </Grid>
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
                    open={openDialogAddGroup || openDialogEditGroup}
                    onClose={handleCloseDialog}
                    onSave={handleAddGroup}
                    onUpdate={handleEditGroup}
                    onDelete={handleDeleteGroup}
                    group={openDialogEditGroup ? selectedGroup : undefined}
                    groups={groups}
                    sportsmen={sportsmen}
                    teams={teams}
                />
            )}
        </div>
    );
});
