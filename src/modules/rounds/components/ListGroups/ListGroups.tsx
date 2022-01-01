import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { IGroup } from '@/types/IGroup';
import { IconButton, List, ListItem, ListItemText, ListSubheader, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import styles from './styles.module.scss';
import { ColorAndChannel } from '@/modules/rounds/components/ColorAndChannel/ColorAndChannel';
import { sportsmanName } from '@/utils/sportsmanName';

interface IProps {
    groups: IGroup[];
    selectedGroup?: IGroup;
    onEdit: (id: string) => void;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

export const ListGroups: FC<IProps> = observer(({ groups, selectedGroup, onEdit, onSelect, onDelete }: IProps) => {
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
                        {group.sportsmen.map((item) => (
                            <ListItem key={item._id} divider selected={isSelected(group)}>
                                {item.position}
                                &nbsp;-&nbsp;
                                <ListItemText primary={sportsmanName(item?.sportsman!)} />
                                {item.channel !== undefined && item.color !== undefined && (
                                    <ColorAndChannel channel={item.channel} color={item.color} />
                                )}
                            </ListItem>
                        ))}
                        {group.teams.map((item) => (
                            <ListItem key={item._id} divider selected={isSelected(group)}>
                                {item.position}
                                &nbsp;-&nbsp;
                                <ListItemText primary={item.team?.name} />
                                {item.channel !== undefined && item.color !== undefined && (
                                    <ColorAndChannel channel={item.channel} color={item.color} />
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            ))}
        </div>
    );
});
