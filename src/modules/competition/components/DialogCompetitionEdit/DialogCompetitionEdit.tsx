import React, { FC, useCallback, useState } from 'react';
import styles from './styles.module.scss';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { insertCompetition } from '../../../../repository/CompetitionRepository';
import { DateTime } from 'luxon';
import { ICompetition } from '../../types/ICompetition';

interface Iprops {
  open: boolean;
  onClose: () => void;
}
export const DialogCompetitionEdit: FC<Iprops> = ({ open, onClose }: Iprops) => {
  const [name, setName] = useState<string>();

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const handleSave = useCallback(async () => {
    if (name) {
      await insertCompetition({ name, dateCreate: DateTime.now(), selected: false } as ICompetition);
      onClose();
    }
  }, [name, onClose]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit competition</DialogTitle>
      <DialogContent>
        <TextField
          id="outlined-basic"
          label="Name competition"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};
