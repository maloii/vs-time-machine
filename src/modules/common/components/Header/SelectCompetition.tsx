import React, { FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Divider, FormControl, MenuItem, TextField } from '@mui/material';
import { DialogCompetitionEdit } from '../../../competition/components/DialogCompetitionEdit/DialogCompetitionEdit';
import { db } from '@/repository/Repository';
import { story } from '@/story/story';
import { loadCompetitionAction } from '@/actions/loadCompetitionAction';

export const SelectCompetition: FC = observer(() => {
    const [open, setOpen] = useState(false);

    const handleChangeCompetition = useCallback(async (event) => {
        if (event.target.value === 0) {
            setOpen(true);
            return;
        }
        await db.competition.update({ selected: true }, { $set: { selected: false } }, { multi: true });
        const selectedCompetition = _.find(story.competitions, ['_id', event.target.value]);
        if (selectedCompetition) {
            await db.competition.update({ _id: selectedCompetition._id }, { $set: { selected: true } });
            await loadCompetitionAction();
        }
    }, []);

    const handleClose = useCallback(() => setOpen(false), []);

    useEffect(() => {
        (async function () {
            await loadCompetitionAction();
        })();
    }, []);

    return (
        <>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                <TextField
                    select
                    value={story.competition?._id || ''}
                    onChange={handleChangeCompetition}
                    label="Competition"
                    size="small"
                >
                    {(story.competitions || []).map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                            {item.name}
                        </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem value={0}>
                        <em>Create new competition</em>
                    </MenuItem>
                </TextField>
            </FormControl>
            <DialogCompetitionEdit open={open} onClose={handleClose} />
        </>
    );
});
