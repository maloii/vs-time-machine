import React, { FC, useCallback } from 'react';
import { ISportsman } from '@/types/ISportsman';
import { observer } from 'mobx-react';
import { Button, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    DataGrid,
    GridCellEditCommitParams,
    GridColumns,
    GridActionsCellItem,
    GridRowParams,
    GridToolbar
} from '@mui/x-data-grid';

import styles from './styles.module.scss';

interface IProps {
    sportsmen: ISportsman[];
    onEditSportsmen: (sportsmen: ISportsman[]) => void;
    onDeleteSportsmen: (id: string) => void;
}

export const Table: FC<IProps> = observer(({ sportsmen, onEditSportsmen, onDeleteSportsmen }: IProps) => {
    const handleCellEditCommit = useCallback(
        (params: GridCellEditCommitParams) => {
            onEditSportsmen(
                sportsmen.map((sportsman) => {
                    if (sportsman._id === params.id) {
                        // @ts-ignore
                        sportsman[params.field] = params.value;
                    }
                    return sportsman;
                })
            );
        },
        [onEditSportsmen, sportsmen]
    );

    const handleChangeSelected = useCallback(
        (_id: string) => () => {
            onEditSportsmen(
                sportsmen.map((sportsman) => {
                    if (sportsman._id === _id) {
                        sportsman.selected = !sportsman.selected;
                    }
                    return sportsman;
                })
            );
        },
        [onEditSportsmen, sportsmen]
    );

    const handleDeleteClick = useCallback(
        (id: string) => () => {
            if (window.confirm('Are you sure you want to remove the sportsman?')) {
                onDeleteSportsmen(id);
            }
        },
        [onDeleteSportsmen]
    );

    const columns: GridColumns = [
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
        { field: 'num', headerName: '№', type: 'number', width: 60, align: 'center' },
        { field: 'lastName', editable: true, headerName: 'Last name', flex: 1 },
        { field: 'firstName', editable: true, headerName: 'First name', flex: 1 },
        { field: 'middleName', editable: true, headerName: 'Middle name', flex: 1 },
        { field: 'nick', editable: true, headerName: 'Nick', flex: 1 },
        { field: 'team', editable: true, headerName: 'Team', flex: 1 },
        { field: 'city', editable: true, headerName: 'City', flex: 1, hide: true },
        { field: 'country', editable: true, headerName: 'Country', flex: 1, hide: true },
        { field: 'age', editable: true, type: 'number', headerName: 'Age', hide: true },
        { field: 'email', editable: true, headerName: 'Email', hide: true },
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            width: 100,
            cellClassName: 'actions',
            getActions: (params: GridRowParams) => {
                return [
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
                columns={columns}
                rows={sportsmen.map((item, indx) => ({ ...item, num: indx + 1 }))}
                onCellEditCommit={handleCellEditCommit}
                getRowId={(row) => row._id}
                hideFooterPagination
                components={{
                    Toolbar: GridToolbar
                }}
            />
        </div>
    );
});
