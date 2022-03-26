import React, { FC, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { Divider, FormControl, MenuItem, TextField } from '@mui/material';
import { DialogCompetitionEdit } from '../../../competition/components/DialogCompetitionEdit/DialogCompetitionEdit';
import { story } from '@/story/story';
import { ICompetition } from '@/types/ICompetition';

export const SelectCompetition: FC = observer(() => {
    const [open, setOpen] = useState(false);
    const [openEditCompetition, setOpenEditCompetition] = useState<ICompetition | undefined>(undefined);

    const handleClick = useCallback(
        (competition?: ICompetition) => () => {
            if (competition) {
                setOpenEditCompetition(competition);
            } else {
                setOpen(true);
            }
        },
        []
    );

    const handleClose = useCallback(() => {
        setOpen(false);
        setOpenEditCompetition(undefined);
    }, []);

    return (
        <>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                <TextField select value={story.competition?._id || ''} label="Competition" size="small">
                    {(story.competitions || []).map((item) => (
                        <MenuItem key={item._id} value={item._id} onClick={handleClick(item)}>
                            {item.name}
                        </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem value={0} onClick={handleClick(undefined)}>
                        <em>Create new competition</em>
                    </MenuItem>
                </TextField>
            </FormControl>
            {(open || !!openEditCompetition) && (
                <DialogCompetitionEdit
                    open={open || !!openEditCompetition}
                    onClose={handleClose}
                    competition={openEditCompetition}
                />
            )}
        </>
    );
});
