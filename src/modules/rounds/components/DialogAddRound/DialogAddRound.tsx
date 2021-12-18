import React, { FC, useCallback, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { db } from '@/repository/Repository';
import { ICompetition } from '@/types/ICompetition';
import { DateTime } from 'luxon';
import { story } from '@/story/story';

interface IProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const DialogAddRound: FC<IProps> = ({ open, onClose, onSave }: IProps) => {
  const [name, setName] = useState('');

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const handleSave = useCallback(async () => onSave(name), [name, onSave]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit competition</DialogTitle>
      <DialogContent>
        <TextField label="Name round" variant="outlined" value={name} onChange={handleNameChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};
