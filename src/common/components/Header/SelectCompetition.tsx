import React, { FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { ICompetition } from '../../../modules/competition/types/ICompetition';
import {
  findCompetitionAll,
  findCompetitionSelected,
  updateCompetitionById
} from '../../../repository/CompetitionRepository';
import _ from 'lodash';
import { FormControl, MenuItem, TextField } from '@mui/material';
import { DialogCompetitionEdit } from '../../../modules/competition/components/DialogCompetitionEdit/DialogCompetitionEdit';

export const SelectCompetition: FC = observer(() => {
  const [open, setOpen] = useState(false);
  const [competition, setCompetition] = useState<ICompetition>();
  const [competitions, setCompetitions] = useState<ICompetition[]>([]);

  const handleChangeCompetition = useCallback(
    async (event) => {
      if (event.target.value === 0) {
        setOpen(true);
        return;
      }
      await Promise.all(
        (competitions || [])
          .filter((item) => item.selected)
          .map((item) => updateCompetitionById(item.id, { ...item, selected: false }))
      );
      const selectedCompetition = _.find(competitions, ['id', event.target.value]);
      if (selectedCompetition) {
        await updateCompetitionById(selectedCompetition.id, { ...selectedCompetition, selected: true });
        setCompetition(selectedCompetition);
      }
    },
    [competitions]
  );

  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    findCompetitionAll().then(setCompetitions);
    findCompetitionSelected().then((data) => setCompetition(data?.[0]));
  }, []);

  return (
    <>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
        <TextField
          select
          value={competition?.id || ''}
          onChange={handleChangeCompetition}
          label="Competition"
          size="small"
        >
          {(competitions || []).map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
          <MenuItem value={0}>
            <em>Create new competition</em>
          </MenuItem>
        </TextField>
      </FormControl>
      <DialogCompetitionEdit open={open} onClose={handleClose} />
    </>
  );
});
