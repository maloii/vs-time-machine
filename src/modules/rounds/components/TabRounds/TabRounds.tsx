import React, { FC, useCallback } from 'react';
import { IRound } from '@/types/IRound';
import { Tabs, Tab, Button, Box } from '@mui/material';
import { observer } from 'mobx-react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import styles from './styles.module.scss';

interface IProps {
    rounds: IRound[];
    selectedId: string | undefined;
    onSelect: (_id: string) => void;
    onAddRound: () => void;
    onEditRound: (_id: string) => void;
}

export const TabRounds: FC<IProps> = observer(({ rounds, selectedId, onSelect, onAddRound, onEditRound }: IProps) => {
    const handleSelect = useCallback((event: React.SyntheticEvent, _id: string) => onSelect(_id), [onSelect]);
    const handleEditRound = useCallback(() => {
        if (selectedId) {
            onEditRound(selectedId);
        }
    }, [onEditRound, selectedId]);
    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <div className={styles.root}>
                <Tabs value={selectedId} onChange={handleSelect} variant="scrollable" scrollButtons="auto">
                    {rounds.map((round) => (
                        <Tab key={round._id} label={round.name} value={round._id} id={round._id} />
                    ))}
                </Tabs>
                <div>
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
