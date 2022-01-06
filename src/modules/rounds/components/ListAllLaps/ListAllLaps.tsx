import React, { FC, useCallback, useMemo } from 'react';
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

interface IProps {
    open: boolean;
    onClose: () => void;
    laps: ILap[];
    onDelete: (id: string) => void;
}

export const ListAllLaps: FC<IProps> = ({ open, onClose, laps, onDelete }: IProps) => {
    const lapsWithPos = useMemo<ILap[]>(() => {
        let pos = 1;
        return (laps || []).map((lap) => {
            if (lap.typeLap === TypeLap.OK) return { ...lap, position: pos++ };
            return lap;
        });
    }, [laps]);
    const handleDelete = useCallback((id: string) => () => onDelete(id), [onDelete]);
    const Row: FC<{ lap: ILap }> = ({ lap }: { lap: ILap }) => {
        return (
            <TableRow>
                <TableCell>{lap.position}</TableCell>
                <TableCell>{DateTime.fromMillis(lap.millisecond).toFormat('dd.MM.yyyy hh:mm.ss')}</TableCell>
                <TableCell>{millisecondsToTimeString(lap.timeLap)}</TableCell>
                <TableCell>{lap.typeLap}</TableCell>
                <TableCell>
                    <IconButton onClick={handleDelete(lap._id)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    };
    return (
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
    );
};
