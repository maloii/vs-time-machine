import React, { FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Button } from '@mui/material';
import {
    handleLoadBroadCastsAction,
    openWindowBroadCastAction,
    handleBroadCastInsertAction,
    handleBroadCastUpdateAction,
    handlebroadCastDeleteAction
} from '@/actions/actionBroadcastRequest';
import { IBroadCast } from '@/types/IBroadCast';
import styles from '@/modules/reports/controllers/styles.module.scss';
import AddIcon from '@mui/icons-material/Add';
import { TableBroadCast } from '@/modules/broadcast/components/TableBroadCast/TableBroadCast';
import { DialogFormBroadCast } from '@/modules/broadcast/components/DialogFormBroadCast/DialogFormBroadCast';
import { story } from '@/story/story';

export const BroadCastController: FC = observer(() => {
    const [openDialogAddBroadCast, setOpenDialogAddBroadCast] = useState(false);
    const [openDialogEditBroadCast, setOpenDialogEditBroadCast] = useState<IBroadCast>();
    const [broadCasts, setBroadCasts] = useState<Array<IBroadCast>>();
    const handleOpenWindowBroadCast = useCallback(
        (broadCast: IBroadCast) => openWindowBroadCastAction(broadCast._id),
        []
    );
    const handleOpenAdd = useCallback(() => setOpenDialogAddBroadCast(true), []);
    const handleOpenEdit = useCallback((broadCasts: IBroadCast) => setOpenDialogEditBroadCast(broadCasts), []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialogAddBroadCast(false);
        setOpenDialogEditBroadCast(undefined);
    }, []);

    const handleLoadBroadCasts = useCallback(() => {
        if (story.competition) {
            handleLoadBroadCastsAction(story.competition._id).then(setBroadCasts);
        }
    }, []);
    const handleAdd = useCallback(
        async (broadCasts: Omit<IBroadCast, '_id' | 'competitionId'>) => {
            if (broadCasts.name && story.competition) {
                await handleBroadCastInsertAction({ ...broadCasts, competitionId: story.competition._id });
                await handleLoadBroadCasts();
                handleCloseDialog();
            }
        },
        [handleCloseDialog, handleLoadBroadCasts]
    );

    const handleEdit = useCallback(
        async (_id: string, broadCasts: Omit<IBroadCast, '_id' | 'competitionId'>) => {
            if (broadCasts.name) {
                await handleBroadCastUpdateAction(_id, broadCasts);
                await handleLoadBroadCasts();
                handleCloseDialog();
            }
        },
        [handleCloseDialog, handleLoadBroadCasts]
    );

    const handleDelete = useCallback(
        async (_id: string) => {
            if (window.confirm('Are you sure you want to delete the report?')) {
                await handlebroadCastDeleteAction(_id);
                await handleLoadBroadCasts();
                handleCloseDialog();
            }
        },
        [handleCloseDialog, handleLoadBroadCasts]
    );

    useEffect(() => {
        handleLoadBroadCasts();
    }, [handleLoadBroadCasts]);

    return (
        <div>
            <div className={styles.actions}>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                    Add broadcast
                </Button>
            </div>
            <TableBroadCast
                broadCasts={broadCasts || []}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onOpen={handleOpenWindowBroadCast}
            />
            {(openDialogAddBroadCast || openDialogEditBroadCast) && (
                <DialogFormBroadCast
                    reports={story.reports}
                    broadCast={openDialogEditBroadCast}
                    open={openDialogAddBroadCast || !!openDialogEditBroadCast}
                    onClose={handleCloseDialog}
                    onSave={handleAdd}
                    onUpdate={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
});
