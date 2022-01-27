import React, { FC, useCallback } from 'react';
import _ from 'lodash';
import { ISportsman } from '@/types/ISportsman';
import { observer } from 'mobx-react';
import { Avatar, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridCellEditCommitParams, GridColumns, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';

import styles from './styles.module.scss';

interface IProps {
    sportsmen: ISportsman[];
    onUpdate: (_id: string, sportsman: Omit<ISportsman, '_id' | 'competitionId'>) => void;
    onDelete: (id: string) => void;
    onOpenEdit: (id: string) => void;
}

export const TableSportsmen: FC<IProps> = observer(({ sportsmen, onUpdate, onDelete, onOpenEdit }: IProps) => {
    const handleCellEditCommit = useCallback(
        (params: GridCellEditCommitParams) => {
            const editSportsman = _.find(sportsmen, ['_id', params.id]);
            if (editSportsman) {
                onUpdate(editSportsman._id, {
                    ...editSportsman,
                    transponders: [...editSportsman.transponders],
                    [params.field]: params.value
                });
            }
        },
        [onUpdate, sportsmen]
    );

    const handleChangeSelected = useCallback(
        (_id: string) => () => {
            const editSportsman = _.find(sportsmen, ['_id', _id]);
            if (editSportsman) {
                onUpdate(editSportsman._id, {
                    ...editSportsman,
                    transponders: [...editSportsman.transponders],
                    selected: !editSportsman.selected
                });
            }
        },
        [onUpdate, sportsmen]
    );

    const handleDeleteClick = useCallback(
        (id: string) => () => {
            onDelete(id);
        },
        [onDelete]
    );

    const handleEditClick = useCallback(
        (id: string) => () => {
            onOpenEdit(id);
        },
        [onOpenEdit]
    );

    const columns: GridColumns = [
        { field: 'num', headerName: '№', type: 'number', width: 60, align: 'center' },
        {
            field: 'selected',
            headerName: '',
            type: 'actions',
            width: 60,
            getActions: (params: GridRowParams) => [
                <Checkbox
                    checked={Boolean(params.getValue(params.id, 'selected'))}
                    onChange={handleChangeSelected(params.id as string)}
                />
            ]
        },
        { field: 'lastName', editable: true, headerName: 'Last name', flex: 1 },
        { field: 'firstName', editable: true, headerName: 'First name', flex: 1 },
        { field: 'middleName', editable: true, headerName: 'Middle name', flex: 1 },
        { field: 'nick', editable: true, headerName: 'Nick', flex: 1 },
        { field: 'transponders', headerName: 'Transponders', flex: 1 },
        { field: 'team', editable: true, headerName: 'Team', flex: 1, hide: true },
        { field: 'city', editable: true, headerName: 'City', flex: 1, hide: true },
        { field: 'country', editable: true, headerName: 'Country', flex: 1, hide: true },
        { field: 'age', editable: true, type: 'number', headerName: 'Age', hide: true },
        { field: 'email', editable: true, headerName: 'Email', hide: true },
        {
            field: 'photo',
            headerName: 'Photo',
            type: 'actions',
            width: 70,
            getActions: (params: GridRowParams) => {
                const photo = String(params.getValue(params.id, 'photo'));
                return [
                    <Avatar
                        alt="Photo"
                        src={!!photo && photo !== window.api.DEFAULT_PHOTO ? window.api.getFilePath(photo) : undefined}
                    />
                ];
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            width: 100,
            cellClassName: 'actions',
            getActions: (params: GridRowParams) => {
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={handleEditClick(params.id as string)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(params.id as string)}
                        color="inherit"
                    />
                ];
            }
        }
    ];

    return (
        <div className={styles.dataGrid}>
            <DataGrid
                hideFooter
                columns={columns}
                rows={sportsmen.map((item, indx) => ({ ...item, num: indx + 1 }))}
                onCellEditCommit={handleCellEditCommit}
                getRowId={(row) => row._id}
                hideFooterPagination
            />
        </div>
    );
});
