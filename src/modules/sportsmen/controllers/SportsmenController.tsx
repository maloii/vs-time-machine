import React, { FC, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Table } from '@/modules/sportsmen/components/table/Table';
import { story } from '@/story/story';
import { db } from '@/repository/Repository';
import { ISportsman } from '@/types/ISportsman';
import { loadCompetitionAction } from '@/actions/loadCompetitionAction';
import { DialogSportsmanEdit } from '@/modules/sportsmen/components/DialogSportsmanEdit/DialogSportsmanEdit';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import styles from './styles.module.scss';

export const SportsmenController: FC = observer(() => {
    const [openDialogAdd, setOpenDialogAdd] = useState(false);
    const [sportsmanEdit, setSportsmanEdit] = useState<ISportsman>();

    const sportsmen = [...story.sportsmen];

    const handleClose = useCallback(() => {
        setOpenDialogAdd(false);
        setSportsmanEdit(undefined);
    }, []);

    const handleOpenAddSportsman = useCallback(() => {
        setOpenDialogAdd(true);
    }, []);

    const handleOpenEditSportsman = useCallback(
        (_id: string) => {
            setSportsmanEdit(_.find(sportsmen, ['_id', _id]));
        },
        [sportsmen]
    );

    const handleSaveSportsman = useCallback(
        async (sportsman: Omit<ISportsman, '_id' | 'competitionId' | 'dateCreate'>) => {
            if (story.competition) {
                await db.sportsman.insert({
                    ...sportsman,
                    competitionId: story.competition._id
                });
                await loadCompetitionAction();
                handleClose();
            }
        },
        [handleClose]
    );

    const handleUpdateSportsman = useCallback(
        async (_id: string, sportsman: Omit<ISportsman, '_id' | 'competitionId' | 'dateCreate'>) => {
            if (story.competition && _id) {
                await db.sportsman.update(
                    { _id },
                    {
                        $set: {
                            ...sportsman
                        }
                    }
                );
                await loadCompetitionAction();
                handleClose();
            }
        },
        [handleClose]
    );

    const handleDeleteSportsmen = useCallback(
        async (_id: string) => {
            if (story.competition) {
                if (window.confirm('Are you sure you want to remove the sportsman?')) {
                    await db.sportsman.remove({ _id }, {});
                    await loadCompetitionAction();
                    handleClose();
                }
            }
        },
        [handleClose]
    );

    if (!story.competition) return null;

    return (
        <div className={styles.root}>
            <div className={styles.actions}>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAddSportsman}>
                    Add sportsman
                </Button>
            </div>
            <Table
                sportsmen={sportsmen}
                onUpdate={handleUpdateSportsman}
                onDelete={handleDeleteSportsmen}
                onOpenEdit={handleOpenEditSportsman}
            />
            {(openDialogAdd || !!sportsmanEdit) && (
                <DialogSportsmanEdit
                    open={openDialogAdd || !!sportsmanEdit}
                    sportsman={sportsmanEdit}
                    onClose={handleClose}
                    onSave={handleSaveSportsman}
                    onUpdate={handleUpdateSportsman}
                    onDelete={handleDeleteSportsmen}
                />
            )}
        </div>
    );
});
