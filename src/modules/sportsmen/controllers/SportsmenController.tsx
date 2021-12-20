import React, { FC, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { Table } from '@/modules/sportsmen/components/table/Table';
import { story } from '@/story/story';
import { db } from '@/repository/Repository';
import { randomId } from '@mui/x-data-grid-generator';
import { DateTime } from 'luxon';
import { ISportsman } from '@/types/ISportsman';
import { loadCompetitionAction } from '@/actions/loadCompetitionAction';
import { DialogSportsmanEdit } from '@/modules/sportsmen/components/DialogSportsmanEdit/DialogSportsmanEdit';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import styles from './styles.module.scss';

export const SportsmenController: FC = observer(() => {
    const [openDialogAdd, setOpenDialogAdd] = useState(false);
    const [sportsmanEdit, setSportsmanEdit] = useState<ISportsman>();

    const handleClose = useCallback(() => {
        setOpenDialogAdd(false);
        setSportsmanEdit(undefined);
    }, []);

    const handleAddSportsman = useCallback(() => {
        setOpenDialogAdd(true);
        // if (story.competition) {
        //     await db.competition.update(
        //         { selected: true },
        //         {
        //             $push: {
        //                 sportsmen: {
        //                     _id: randomId(),
        //                     dateCreate: DateTime.now(),
        //                     firstName: '',
        //                     lastName: '',
        //                     middleName: ''
        //                 }
        //             }
        //         }
        //     );
        //     await loadCompetitionAction();
        // }
    }, []);

    const handleEditSportsmen = useCallback(async (sportsmen: ISportsman[]) => {
        if (story.competition) {
            await db.competition.update(
                { selected: true },
                {
                    $set: {
                        sportsmen
                    }
                }
            );
            await loadCompetitionAction();
        }
    }, []);

    const handleDeleteSportsmen = useCallback(async (_id: string) => {
        if (story.competition) {
            await db.competition.update(
                { selected: true },
                {
                    $set: {
                        sportsmen: [...story.competition.sportsmen].filter((item) => item._id !== _id)
                    }
                }
            );
            await loadCompetitionAction();
        }
    }, []);

    if (!story.competition) return null;

    return (
        <div className={styles.root}>
            <div className={styles.actions}>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleAddSportsman}>
                    Add sportsman
                </Button>
            </div>
            <Table
                sportsmen={[...story.competition.sportsmen]}
                onEditSportsmen={handleEditSportsmen}
                onDeleteSportsmen={handleDeleteSportsmen}
            />
            {(openDialogAdd || !!sportsmanEdit) && (
                <DialogSportsmanEdit
                    open={openDialogAdd || !!sportsmanEdit}
                    sportsman={sportsmanEdit}
                    onClose={handleClose}
                />
            )}
        </div>
    );
});
