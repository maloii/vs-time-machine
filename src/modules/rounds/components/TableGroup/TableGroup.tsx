import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { IGroup, IMembersGroup } from '@/types/IGroup';
import styles from '@/modules/rounds/components/ListGroups/styles.module.scss';
import { IconButton, List, ListItem, ListItemText, ListSubheader, Paper } from '@mui/material';
import cn from 'classnames';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { sportsmanName } from '@/utils/sportsmanName';
import { ColorAndChannel } from '@/modules/rounds/components/ColorAndChannel/ColorAndChannel';
import { ICompetition } from '@/types/ICompetition';

interface IProps {
    group: IGroup;
    selectedGroup?: IGroup;
    competition: ICompetition;
    onSelect: (id: string) => () => void;
    onEdit: (id: string) => () => void;
    onDelete: (id: string) => () => void;
    onUpdate: (id: string, group: IGroup) => void;
}

export const TableGroup: FC<IProps> = ({
    group,
    selectedGroup,
    competition,
    onSelect,
    onEdit,
    onDelete,
    onUpdate
}: IProps) => {
    const draggedItem = useRef<string | undefined>(undefined);
    const [innerGroup, setInnerGroup] = useState(_.cloneDeep(group));
    const isSelected = (item: IGroup) => selectedGroup?._id === item._id;

    const onDragItemStart = useCallback(
        (id: string) => (e: React.DragEvent<HTMLLIElement>) => {
            draggedItem.current = id;
            e.dataTransfer.effectAllowed = 'move';
        },
        []
    );

    const onDragItemOver = useCallback(
        (id: string) => (e: React.DragEvent<HTMLLIElement>) => {
            e.preventDefault();
            const isSportsmen = innerGroup?.sportsmen?.length > 0;
            const items = isSportsmen ? innerGroup.sportsmen : innerGroup.teams;
            const index = _.findIndex(items, (item: IMembersGroup) => item._id === id);
            if (!draggedItem.current || draggedItem.current === items[index]._id) {
                return;
            }
            const oldIndex = _.findIndex(items, (item: IMembersGroup) => item._id === draggedItem.current);
            [items[index], items[oldIndex]] = [items[oldIndex], items[index]];
            const sortedItems = items.map((item: IMembersGroup, indx: number) => {
                const startNumber = indx + 1;
                const colorAndChannel = window.api.competitionColorAndChannel(startNumber, _.cloneDeep(competition));
                return {
                    ...item,
                    startNumber,
                    color: colorAndChannel?.color,
                    channel: colorAndChannel?.channel
                };
            });
            setInnerGroup({
                ...innerGroup,
                teams: isSportsmen ? innerGroup.teams : sortedItems,
                sportsmen: isSportsmen ? sortedItems : innerGroup.sportsmen
            });
        },
        [competition, innerGroup]
    );

    const onDragItemEnd = useCallback(() => {
        draggedItem.current = undefined;
        onUpdate(innerGroup._id, innerGroup);
    }, [innerGroup, onUpdate]);

    useEffect(() => {
        setInnerGroup(_.cloneDeep(group));
    }, [group]);

    return (
        <Paper key={innerGroup._id} elevation={isSelected(innerGroup) ? 5 : 1} className={styles.paper}>
            <List
                dense
                onClick={onSelect(innerGroup._id)}
                className={styles.group}
                component="nav"
                subheader={
                    <ListSubheader
                        disableSticky
                        component="div"
                        className={cn(styles.headerGroup, { [styles.selected]: isSelected(innerGroup) })}
                    >
                        {innerGroup.name}
                        <div className={styles.actionsGroup}>
                            <IconButton onClick={onEdit(innerGroup._id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={onDelete(innerGroup._id)}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </ListSubheader>
                }
            >
                {[...(innerGroup.sportsmen || []), ...(innerGroup.teams || [])].map((item) => (
                    <ListItem
                        key={item._id}
                        divider
                        draggable="true"
                        selected={isSelected(innerGroup)}
                        onDragStart={onDragItemStart(item._id)}
                        onDragOver={onDragItemOver(item._id)}
                        onDragEnd={onDragItemEnd}
                    >
                        {item.startNumber}
                        &nbsp;-&nbsp;
                        <ListItemText primary={item.team?.name || sportsmanName(item?.sportsman!)} />
                        {item.channel !== undefined && item.color !== undefined && (
                            <ColorAndChannel channel={item.channel} color={item.color} />
                        )}
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};
