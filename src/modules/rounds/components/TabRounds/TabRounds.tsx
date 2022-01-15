import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { IRound } from '@/types/IRound';
import { Tabs, Tab, Button, Box } from '@mui/material';
import { observer } from 'mobx-react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { roundUpdateAction } from '@/actions/actionRoundRequest';

import styles from './styles.module.scss';

interface IProps {
    rounds: IRound[];
    selectedId: string | undefined;
    onSelect: (_id: string) => void;
    onAddRound: () => void;
    onEditRound: (_id: string) => void;
}

export const TabRounds: FC<IProps> = observer(({ rounds, selectedId, onSelect, onAddRound, onEditRound }: IProps) => {
    const [innerRounds, setInnerRounds] = useState(_.cloneDeep(rounds));
    const draggedItem = useRef<string | undefined>(undefined);
    const handleSelect = useCallback((event: React.SyntheticEvent, _id: string) => onSelect(_id), [onSelect]);
    const handleEditRound = useCallback(() => {
        if (selectedId) {
            onEditRound(selectedId);
        }
    }, [onEditRound, selectedId]);

    const onDragItemStart = useCallback(
        (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
            draggedItem.current = id;
            e.dataTransfer.effectAllowed = 'move';
        },
        []
    );

    const onDragItemOver = useCallback(
        (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            const index = _.findIndex(innerRounds, (item) => item._id === id);
            if (!draggedItem.current || draggedItem.current === innerRounds[index]._id) {
                return;
            }
            const oldIndex = _.findIndex(innerRounds, (item) => item._id === draggedItem.current);
            [innerRounds[index], innerRounds[oldIndex]] = [innerRounds[oldIndex], innerRounds[index]];
            setInnerRounds(innerRounds.map((round, indx) => ({ ...round, sort: indx })));
        },
        [innerRounds]
    );

    const onDragItemEnd = () => {
        draggedItem.current = undefined;
        innerRounds.forEach((round) => roundUpdateAction(round._id, { sort: round.sort }));
    };

    useEffect(() => {
        setInnerRounds(rounds);
    }, [rounds]);

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <div className={styles.root}>
                <Tabs value={selectedId} onChange={handleSelect} variant="scrollable" scrollButtons="auto">
                    {innerRounds.map((round) => (
                        // @ts-ignore
                        <Tab
                            draggable="true"
                            onDragStart={onDragItemStart(round._id)}
                            onDragOver={onDragItemOver(round._id)}
                            onDragEnd={onDragItemEnd}
                            key={round._id}
                            label={round.name}
                            value={round._id}
                            id={round._id}
                        />
                    ))}
                </Tabs>
                <div className={styles.actions}>
                    {!!selectedId && (
                        <Button color="primary" startIcon={<EditIcon />} onClick={handleEditRound}>
                            Edit round
                        </Button>
                    )}
                    <Button color="primary" startIcon={<AddIcon />} onClick={onAddRound}>
                        Add round
                    </Button>
                </div>
            </div>
        </Box>
    );
});
