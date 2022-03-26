import React, { FC, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { Button } from '@mui/material';
import {
    openWindowBroadCastAction,
    broadCastUpdateAction,
    broadCastDeleteAction,
    broadCastInsertAction
} from '@/actions/actionBroadcastRequest';
import { IBroadCast } from '@/types/IBroadCast';
import styles from '@/modules/reports/containers/styles.module.scss';
import AddIcon from '@mui/icons-material/Add';
import { TableBroadCast } from '@/modules/broadcast/components/TableBroadCast/TableBroadCast';
import { DialogFormBroadCast } from '@/modules/broadcast/components/DialogFormBroadCast/DialogFormBroadCast';
import { story } from '@/story/story';

export const BroadCastContainer: FC = observer(() => {
    const [openDialogAddBroadCast, setOpenDialogAddBroadCast] = useState(false);
    const [openDialogEditBroadCast, setOpenDialogEditBroadCast] = useState<IBroadCast>();

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

    const handleAdd = useCallback(
        async (broadCasts: Omit<IBroadCast, '_id' | 'competitionId'>) => {
            if (broadCasts.name && story.competition) {
                broadCastInsertAction({ ...broadCasts, competitionId: story.competition._id });
                handleCloseDialog();
            }
        },
        [handleCloseDialog]
    );

    const handleEdit = useCallback(
        async (_id: string, broadCasts: Omit<IBroadCast, '_id' | 'competitionId'> | Pick<IBroadCast, 'background'>) => {
            broadCastUpdateAction(_id, broadCasts);
            handleCloseDialog();
        },
        [handleCloseDialog]
    );

    const handleDelete = useCallback(
        async (_id: string) => {
            if (window.confirm('Are you sure you want to delete the report?')) {
                broadCastDeleteAction(_id);
                handleCloseDialog();
            }
        },
        [handleCloseDialog]
    );

    return (
        <div>
            <div className={styles.actions}>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                    Add broadcast
                </Button>
            </div>
            <TableBroadCast
                broadCasts={story.broadCasts || []}
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
