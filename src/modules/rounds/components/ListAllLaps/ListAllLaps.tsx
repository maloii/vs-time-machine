import React, { FC, useCallback, useMemo, useState } from 'react';
import { ILap } from '@/types/ILap';
import { DateTime } from 'luxon';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { TypeLap } from '@/types/TypeLap';
import { millisecondsToTimeString } from '@/utils/millisecondsToTimeString';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DialogFormLap } from '@/modules/rounds/components/DialogFormLap/DialogFormLap';

import styles from './styles.module.scss';

interface IProps {
    open: boolean;
    onClose: () => void;
    laps: ILap[];
    onDelete: (id: string) => void;
    onUpdate: (_id: string, lap: Pick<ILap, 'typeLap'>) => void;
}

export const ListAllLaps: FC<IProps> = ({ open, onClose, laps, onDelete, onUpdate }: IProps) => {
    const [editLap, setEditLap] = useState<ILap | undefined>(undefined);

    const lapsWithPos = useMemo<ILap[]>(() => {
        let pos = 1;
        return (laps || []).map((lap) => {
            if (lap.typeLap === TypeLap.OK) return { ...lap, position: pos++ };
            return lap;
        });
    }, [laps]);
    const handleDelete = useCallback(
        (id: string) => () => {
            if (window.confirm('Are you sure you want to delete the lap?')) {
                onDelete(id);
                setEditLap(undefined);
            }
        },
        [onDelete]
    );
    const handleOpenEdit = useCallback((lap: ILap) => () => setEditLap(lap), [setEditLap]);
    const handleCloseEdit = useCallback(() => setEditLap(undefined), [setEditLap]);
    const handleSave = useCallback(
        (id: string, lap: Pick<ILap, 'typeLap'>) => {
            onUpdate(id, lap);
            setEditLap(undefined);
        },
        [onUpdate]
    );

    const Row: FC<{ lap: ILap }> = ({ lap }: { lap: ILap }) => {
        return (
            <TableRow>
                <TableCell>{lap.position}</TableCell>
                <TableCell>{DateTime.fromMillis(lap.millisecond).toFormat('dd.MM.yyyy hh:mm.ss')}</TableCell>
                <TableCell>{lap.timeLap ? millisecondsToTimeString(lap.timeLap) : '--:--:---'}</TableCell>
                <TableCell>{lap.typeLap}</TableCell>
                <TableCell>
                    <div className={styles.actions}>
                        <IconButton onClick={handleOpenEdit(lap)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={handleDelete(lap._id)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>All laps</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Lap</TableCell>
                                    <TableCell>DateTime</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lapsWithPos.map((lap, indx) => (
                                    <Row key={lap._id} lap={lap} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>

            {!!editLap && (
                <DialogFormLap
                    lap={editLap}
                    open={!!editLap}
                    onDelete={handleDelete}
                    onClose={handleCloseEdit}
                    onUpdate={handleSave}
                />
            )}
        </>
    );
};
