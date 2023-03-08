import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { IGroup } from '@/types/IGroup';
import { TableGroup } from '@/modules/rounds/components/TableGroup/TableGroup';
import { ICompetition } from '@/types/ICompetition';

import styles from './styles.module.scss';

interface IProps {
    groups: IGroup[];
    selectedGroup?: IGroup;
    groupInRace?: IGroup;
    competition: ICompetition;
    onEdit: (id: string) => void;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, group: Omit<IGroup, '_id' | 'roundId' | 'close' | 'sort' | 'timeStart'>) => void;
}

export const ListGroups: FC<IProps> = observer(
    ({ groups, selectedGroup, groupInRace, competition, onEdit, onSelect, onDelete, onUpdate }: IProps) => {
        const handleEdit = useCallback((id: string) => () => onEdit(id), [onEdit]);
        const handleSelect = useCallback((id: string) => () => onSelect(id), [onSelect]);
        const handleDelete = useCallback((id: string) => () => onDelete(id), [onDelete]);

        if ((groups || []).length === 0) {
            return <div className={styles.empty}>No groups</div>;
        }

        return (
            <div className={styles.root}>
                {(groups || []).map((group) => (
                    <TableGroup
                        key={group._id}
                        group={group}
                        selectedGroup={selectedGroup}
                        competition={competition}
                        isGroupInRace={group._id === groupInRace?._id}
                        onSelect={handleSelect}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onUpdate={onUpdate}
                    />
                ))}
            </div>
        );
    }
);
