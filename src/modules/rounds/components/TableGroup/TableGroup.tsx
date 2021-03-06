import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { IGroup, IMembersGroup } from '@/types/IGroup';
import styles from '@/modules/rounds/components/ListGroups/styles.module.scss';
import { IconButton, List, ListItem, ListItemText, ListSubheader, MenuItem, Paper, Menu } from '@mui/material';
import cn from 'classnames';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { sportsmanName } from '@/utils/sportsmanName';
import { ColorAndChannel } from '@/modules/rounds/components/ColorAndChannel/ColorAndChannel';
import { ICompetition } from '@/types/ICompetition';
import { DialogFormMembersGroup } from '@/modules/rounds/components/DialogFormMembersGroup/DialogFormMembersGroup';
import { Color } from '@/types/Color';
import { Channel } from '@/types/VTXChannel';

interface IProps {
    group: IGroup;
    selectedGroup?: IGroup;
    competition: ICompetition;
    isGroupInRace: boolean;
    onSelect: (id: string) => () => void;
    onEdit: (id: string) => () => void;
    onDelete: (id: string) => () => void;
    onUpdate: (id: string, group: IGroup) => void;
}

export const TableGroup: FC<IProps> = ({
    group,
    selectedGroup,
    competition,
    isGroupInRace,
    onSelect,
    onEdit,
    onDelete,
    onUpdate
}: IProps) => {
    const draggedItem = useRef<string | undefined>(undefined);
    const [innerGroup, setInnerGroup] = useState(_.cloneDeep(group));
    const [contextMenu, setContextMenu] = React.useState<
        | {
              mouseX: number;
              mouseY: number;
              membersGroup: IMembersGroup;
          }
        | undefined
    >(undefined);
    const [openEdit, setOpenEdit] = useState<IMembersGroup>();

    const isSelected = (item: IGroup) => selectedGroup?._id === item._id;

    const handleContextMenu = useCallback(
        (membersGroup: IMembersGroup) => (event: React.MouseEvent<HTMLLIElement>) => {
            event.preventDefault();
            setContextMenu(
                contextMenu === undefined
                    ? {
                          mouseX: event.clientX - 2,
                          mouseY: event.clientY - 4,
                          membersGroup
                      }
                    : undefined
            );
        },
        [contextMenu]
    );

    const handleClose = useCallback(() => {
        setOpenEdit(undefined);
        setContextMenu(undefined);
    }, []);

    const handleOpenEditDialog = useCallback(() => {
        setOpenEdit(contextMenu?.membersGroup);
        setContextMenu(undefined);
    }, [contextMenu?.membersGroup]);

    const handleUpdateMemberGroup = useCallback(
        (_id: string, color: Color, channel: Channel) => {
            onUpdate(innerGroup._id, {
                ...innerGroup,
                teams: innerGroup.teams.map((item) => {
                    if (item._id === _id) {
                        return {
                            ...item,
                            color,
                            channel
                        };
                    }
                    return item;
                }),
                sportsmen: innerGroup.sportsmen.map((item) => {
                    if (item._id === _id) {
                        return {
                            ...item,
                            color,
                            channel
                        };
                    }
                    return item;
                })
            });
            handleClose();
        },
        [innerGroup, onUpdate, handleClose]
    );

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
                className={cn(styles.group, { [styles.groupInRace]: isGroupInRace })}
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
                        onContextMenu={handleContextMenu(item)}
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
            <Menu
                open={contextMenu !== undefined}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== undefined ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
                }
            >
                <MenuItem onClick={handleOpenEditDialog}>Edit</MenuItem>
            </Menu>
            {!!openEdit && (
                <DialogFormMembersGroup
                    open={!!openEdit}
                    membersGroup={openEdit}
                    onClose={handleClose}
                    onUpdate={handleUpdateMemberGroup}
                />
            )}
        </Paper>
    );
};
