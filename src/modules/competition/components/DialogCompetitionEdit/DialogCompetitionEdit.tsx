import React, { FC, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { ICompetition } from '@/types/ICompetition';
import { db } from '@/repository/Repository';
import { loadCompetitionAction } from '@/actions/loadCompetitionAction';

interface Iprops {
    open: boolean;
    onClose: () => void;
}
export const DialogCompetitionEdit: FC<Iprops> = observer(({ open, onClose }: Iprops) => {
    const [name, setName] = useState<string>();

    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);

    const handleSave = useCallback(async () => {
        if (name) {
            await db.competition.update({ selected: true }, { $set: { selected: false } });
            await db.competition.insert<Omit<ICompetition, '_id'>>({
                name,
                selected: true,
                gates: []
            });
            await loadCompetitionAction();
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
});
