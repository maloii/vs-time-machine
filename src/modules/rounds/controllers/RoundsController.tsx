import React, { FC, useCallback, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { observer } from 'mobx-react';

import { TabRounds } from '@/modules/rounds/components/TabRounds/TabRounds';
import { story } from '@/story/story';
import { db } from '@/repository/Repository';
import { DialogFormRound } from '@/modules/rounds/components/DialogAddRound/DialogFormRound';

import styles from './styles.module.scss';
import { IRound } from '@/types/IRound';
import { loadCompetitionAction } from '@/actions/loadCompetitionAction';

export const RoundsController: FC = observer(() => {
    const [openDialogAdd, setOpenDialogAdd] = useState(false);
    const [openDialogEdit, setOpenDialogEdit] = useState(false);

    const rounds = [...(story.rounds || [])].sort((a, b) => a.sort - b.sort);

    const selectedRound = useMemo(() => rounds.find((round) => round.selected), [rounds]);

    const handleSelectRound = useCallback(async (_id: string) => {
        if (story.competition) {
            await db.round.update(
                { competitionId: story.competition._id, selected: true },
                { $set: { selected: false } },
                { multi: true }
            );
            await db.round.update({ _id }, { $set: { selected: true } });
            await loadCompetitionAction();
        }
    }, []);

    const handleOpenAddRound = useCallback(() => setOpenDialogAdd(true), []);
    const handleOpenEditRound = useCallback(() => setOpenDialogEdit(true), []);
    const handleCloseDialog = useCallback(() => {
        setOpenDialogAdd(false);
        setOpenDialogEdit(false);
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
                    dateCreate: DateTime.now(),
                    sort: rounds.length,
                    selected: true
                });
                await loadCompetitionAction();
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
                await loadCompetitionAction();
                handleCloseDialog();
            }
        },
        [selectedRound, handleCloseDialog]
    );

    const handleDeleteRound = useCallback(
        async (_id: string) => {
            await db.round.remove({ _id }, {});
            await loadCompetitionAction();

            if ((rounds || []).length > 1) {
                const newSelectedRound = rounds[rounds.length - 2];
                await db.round.update({ _id: newSelectedRound._id }, { $set: { selected: true } });
                await loadCompetitionAction();
            }
            handleCloseDialog();
        },
        [handleCloseDialog, rounds]
    );

    return (
        <div className={styles.root}>
            <TabRounds
                rounds={rounds}
                selectedId={selectedRound?._id}
                onSelect={handleSelectRound}
                onAddRound={handleOpenAddRound}
                onEditRound={handleOpenEditRound}
            />
            {(openDialogAdd || openDialogEdit) && (
                <DialogFormRound
                    open={openDialogAdd || openDialogEdit}
                    onClose={handleCloseDialog}
                    onSave={handleAddRound}
                    onUpdate={handleEditRound}
                    onDelete={handleDeleteRound}
                    rounds={rounds}
                    round={openDialogEdit ? selectedRound : undefined}
                />
            )}
        </div>
    );
});
