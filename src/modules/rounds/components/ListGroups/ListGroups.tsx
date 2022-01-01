import React, { FC, useCallback } from 'react';
import _ from 'lodash';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { IGroup, IMembersGroup } from '@/types/IGroup';
import { IconButton, List, ListItem, ListItemText, ListSubheader, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ISportsman } from '@/types/ISportsman';
import { ICompetition } from '@/types/ICompetition';
import { ITeam } from '@/types/ITeam';

import styles from './styles.module.scss';
import { ColorAndChannel } from '@/modules/rounds/components/ColorAndChannel/ColorAndChannel';

interface IProps {
    groups: IGroup[];
    sportsmen: ISportsman[];
    teams: ITeam[];
    selectedGroup?: IGroup;
    onEdit: (id: string) => void;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

export const ListGroups: FC<IProps> = observer(
    ({ groups, sportsmen, teams, selectedGroup, onEdit, onSelect, onDelete }: IProps) => {
        const isSelected = (group: IGroup) => selectedGroup?._id === group._id;

        const handleEdit = useCallback((id: string) => () => onEdit(id), [onEdit]);
        const handleSelect = useCallback((id: string) => () => onSelect(id), [onSelect]);
        const handleDelete = useCallback((id: string) => () => onDelete(id), [onDelete]);

        if ((groups || []).length === 0) {
            return <div className={styles.empty}>No groups</div>;
        }
        return (
            <div>
                {(groups || []).map((group) => (
                    <Paper key={group._id} elevation={isSelected(group) ? 5 : 1} className={styles.paper}>
                        <List
                            onClick={handleSelect(group._id)}
                            className={styles.group}
                            component="nav"
                            subheader={
                                <ListSubheader
                                    component="div"
                                    className={cn(styles.headerGroup, { [styles.selected]: isSelected(group) })}
                                >
                                    {group.name}
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
                            {group.sportsmen
                                .map(
                                    (item): IMembersGroup => ({
                                        ...item,
                                        sportsman: _.find<ISportsman>(sportsmen, ['_id', item._id])
                                    })
                                )
                                .filter((item) => !!item.sportsman)
                                .map((item) => (
                                    <ListItem key={item._id} divider selected={isSelected(group)}>
                                        <ListItemText
                                            primary={`${item?.sportsman?.lastName || ''}${
                                                item?.sportsman?.firstName ? ` ${item?.sportsman?.firstName}` : ''
                                            } ${item?.sportsman?.middleName ? ` ${item?.sportsman?.middleName}` : ''}${
                                                item?.sportsman?.nick ? ` (${item?.sportsman?.nick})` : ''
                                            }`}
                                        />
                                        {item.channel && item.color && (
                                            <ColorAndChannel channel={item.channel} color={item.color} />
                                        )}
                                    </ListItem>
                                ))}
                            {group.teams
                                .map(
                                    (item): IMembersGroup => ({
                                        ...item,
                                        team: _.find<ITeam>(teams, ['_id', item._id])
                                    })
                                )
                                .filter((item) => !!item.team)
                                .map((item) => (
                                    <ListItem key={item._id} divider selected={isSelected(group)}>
                                        <ListItemText primary={item.team?.name} />
                                        {item.channel && item.color && (
                                            <ColorAndChannel channel={item.channel} color={item.color} />
                                        )}
                                    </ListItem>
                                ))}
                        </List>
                    </Paper>
                ))}
            </div>
        );
    }
);
