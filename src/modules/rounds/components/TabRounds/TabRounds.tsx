import React, { FC, useCallback } from 'react';
import { IRound } from '@/types/IRound';
import { Tabs, Tab, Button, Box } from '@mui/material';
import { observer } from 'mobx-react';
import AddIcon from '@mui/icons-material/Add';

import styles from './styles.module.scss';

interface IProps {
  rounds: IRound[];
  selectedId: string | undefined;
  onSelect: (_id: string) => void;
  onAddRound: () => void;
}

export const TabRounds: FC<IProps> = observer(({ rounds, selectedId, onSelect, onAddRound }: IProps) => {
  const handleSelect = useCallback((event: React.SyntheticEvent, _id: string) => onSelect(_id), [onSelect]);
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <div className={styles.root}>
        <Tabs value={selectedId} onChange={handleSelect}>
          {rounds.map((round) => (
            <Tab label={round.name} value={round._id} id={round._id} />
          ))}
        </Tabs>
        <Button color="primary" startIcon={<AddIcon />} onClick={onAddRound}>
          Add round
        </Button>
      </div>
    </Box>
  );
});
