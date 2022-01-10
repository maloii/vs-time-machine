import React, { FC, useCallback } from 'react';
import { IReport } from '@/types/IReport';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './styles.module.scss';

interface IProps {
    reports: IReport[];
    onDelete: (_id: string) => void;
    onEdit: (report: IReport) => void;
}

export const TableReports: FC<IProps> = ({ reports, onDelete, onEdit }: IProps) => {
    const handleEdit = useCallback((report: IReport) => () => onEdit(report), [onEdit]);
    const handleDelete = useCallback((id: string) => () => onDelete(id), [onDelete]);
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
                    {reports.map((report) => (
                        <TableRow key={report._id}>
                            <TableCell>{report.name}</TableCell>
                            <TableCell>
                                <div className={styles.actions}>
                                    <IconButton onClick={handleEdit(report)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={handleDelete(report._id)}>
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
