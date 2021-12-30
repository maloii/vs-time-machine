import React, { FC, useCallback } from 'react';
import { IGate } from '@/types/IGate';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import styles from './styles.module.scss';

interface IProps {
    gates: IGate[];
    onUpdate: (id: string) => void;
    onDelete: (id: string) => void;
}

export const TableGates: FC<IProps> = ({ gates, onUpdate, onDelete }: IProps) => {
    const handleUpdate = useCallback((id: string) => () => onUpdate(id), [onUpdate]);
    const handleDelete = useCallback((id: string) => () => onDelete(id), [onDelete]);
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Pos.</TableCell>
                        <TableCell>Number</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Delay</TableCell>
                        <TableCell>Dist.</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {gates
                        .sort((g1, g2) => g1.position - g2.position)
                        .map((gate) => (
                            <TableRow key={gate._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{gate.position}</TableCell>
                                <TableCell>{gate.number || 'Any'}</TableCell>
                                <TableCell>{gate.type}</TableCell>
                                <TableCell>{gate.delay}</TableCell>
                                <TableCell>{gate.distance}</TableCell>
                                <TableCell className={styles.actionsTableTd}>
                                    <div className={styles.actionsTable}>
                                        <IconButton onClick={handleUpdate(gate._id)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={handleDelete(gate._id)}>
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
