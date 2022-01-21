import React, { FC, useCallback } from 'react';
import {
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IBroadCast } from '@/types/IBroadCast';

import styles from './styles.module.scss';

interface IProps {
    broadCasts: IBroadCast[];
    onDelete: (_id: string) => void;
    onEdit: (broadCast: IBroadCast) => void;
    onOpen: (broadCast: IBroadCast) => void;
}

export const TableBroadCast: FC<IProps> = ({ broadCasts, onDelete, onEdit, onOpen }: IProps) => {
    const handleEdit = useCallback((broadCast: IBroadCast) => () => onEdit(broadCast), [onEdit]);
    const handleDelete = useCallback((id: string) => () => onDelete(id), [onDelete]);
    const handleOpenBroadCast = useCallback((broadCast) => () => onOpen(broadCast), [onOpen]);
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {broadCasts.map((broadCast) => (
                        <TableRow key={broadCast._id}>
                            <TableCell>
                                <Button onClick={handleOpenBroadCast(broadCast)}>{broadCast.name}</Button>
                            </TableCell>
                            <TableCell>
                                <div className={styles.actions}>
                                    <IconButton onClick={handleEdit(broadCast)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={handleDelete(broadCast._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
