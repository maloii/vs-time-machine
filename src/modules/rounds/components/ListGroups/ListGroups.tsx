import React, { FC, useCallback } from 'react';
import _ from 'lodash';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { IGroup } from '@/types/IGroup';
import { IconButton, List, ListItem, ListItemText, ListSubheader, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ISportsman } from '@/types/ISportsman';
import { ICompetition } from '@/types/ICompetition';
import { ITeam } from '@/types/ITeam';

import styles from './styles.module.scss';

interface IProps {
    groups: IGroup[];
    sportsmen: ISportsman[];
    teams: ITeam[];
    competition: ICompetition;
    selectedGroup?: IGroup;
    onEdit: (id: string) => void;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

export const ListGroups: FC<IProps> = observer(
    ({ groups, sportsmen, teams, competition, selectedGroup, onEdit, onSelect, onDelete }: IProps) => {
        const isSelected = (group: IGroup) => selectedGroup?._id === group._id;

        const handleEdit = useCallback((id: string) => () => onEdit(id), [onEdit]);
        const handleSelect = useCallback((id: string) => () => onSelect(id), [onSelect]);
        const handleDelete = useCallback((id: string) => () => onDelete(id), [onDelete]);
        return (
            <Paper elevation={0} variant="outlined" className={styles.paper}>
                {(groups || []).map((group) => (
                    <List
                        className={styles.group}
                        component="nav"
                        subheader={
                            <ListSubheader
                                component="div"
                                className={cn(styles.headerGroup, { [styles.selected]: isSelected(group) })}
                            >
                                <div onClick={handleSelect(group._id)}>{group.name}</div>
                                <div className={styles.actionsGroup}>
                                    <IconButton onClick={handleEdit(group._id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={handleDelete(group._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </ListSubheader>
                        }
                    >
                        {group.sportsmenIds
                            .map((id) => _.find<ISportsman>(sportsmen, ['_id', id]))
                            .filter((sportsman) => !!sportsman)
                            .map((sportsman) => (
                                <ListItem divider selected={isSelected(group)}>
                                    <ListItemText
                                        primary={`${sportsman?.lastName || ''}${
                                            sportsman?.firstName ? ` ${sportsman?.firstName}` : ''
                                        } ${sportsman?.middleName ? ` ${sportsman?.middleName}` : ''}${
                                            sportsman?.nick ? ` (${sportsman?.nick})` : ''
                                        }`}
                                    />
                                </ListItem>
                            ))}
                        {group.teamsIds
                            .map((id) => _.find<ITeam>(teams, ['_id', id]))
                            .filter((team) => !!team)
                            .map((team) => (
                                <ListItem divider selected={isSelected(group)}>
                                    <ListItemText primary={team?.name} />
                                </ListItem>
                            ))}
                    </List>
                ))}
            </Paper>
        );
    }
);
