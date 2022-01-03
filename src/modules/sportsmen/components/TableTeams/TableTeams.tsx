import React, { FC, useCallback } from 'react';
import _ from 'lodash';
import { ITeam } from '@/types/ITeam';
import {
    DataGrid,
    GridActionsCellItem,
    GridCellEditCommitParams,
    GridColumns,
    GridRowParams,
    GridToolbar
} from '@mui/x-data-grid';
import { Avatar, Checkbox } from '@mui/material';
import { DEFAULT_PHOTO } from '@/constants/images';
import { getFilePath } from '@/utils/fileUtils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import styles from './styles.module.scss';

interface IProps {
    teams: ITeam[];
    onUpdate: (_id: string, team: Omit<ITeam, '_id' | 'competitionId'>) => void;
    onDelete: (id: string) => void;
    onOpenEdit: (id: string) => void;
}

export const TableTeams: FC<IProps> = ({ teams, onUpdate, onDelete, onOpenEdit }: IProps) => {
    const handleCellEditCommit = useCallback(
        (params: GridCellEditCommitParams) => {
            const editTeam = _.find(teams, ['_id', params.id]);
            if (editTeam) {
                onUpdate(editTeam._id, {
                    ...editTeam,
                    sportsmenIds: [...editTeam.sportsmenIds],
                    [params.field]: params.value
                });
            }
        },
        [onUpdate, teams]
    );

    const handleChangeSelected = useCallback(
        (_id: string) => () => {
            const editTeam = _.find(teams, ['_id', _id]);
            if (editTeam) {
                onUpdate(editTeam._id, {
                    ...editTeam,
                    sportsmenIds: [...editTeam.sportsmenIds],
                    selected: !editTeam.selected
                });
            }
        },
        [onUpdate, teams]
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
        { field: 'name', editable: true, headerName: 'Name', flex: 1 },
        { field: 'city', editable: true, headerName: 'City', flex: 1 },
        { field: 'country', editable: true, headerName: 'Country', flex: 1, hide: true },
        {
            field: 'photo',
            headerName: 'Photo',
            type: 'actions',
            width: 70,
            getActions: (params: GridRowParams) => {
                const photo = String(params.getValue(params.id, 'photo'));
                return [
                    <Avatar
                        alt="Remy Sharp"
                        src={!!photo && photo !== DEFAULT_PHOTO ? getFilePath(photo) : undefined}
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
                columns={columns}
                rows={teams.map((item, indx) => ({ ...item, num: indx + 1 }))}
                onCellEditCommit={handleCellEditCommit}
                getRowId={(row) => row._id}
                hideFooterPagination
                components={{
                    Toolbar: GridToolbar
                }}
            />
        </div>
    );
};
