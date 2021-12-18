import React, { FC, useCallback, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { observer } from 'mobx-react';

import { TabRounds } from '@/modules/rounds/components/TabRounds/TabRounds';
import { story } from '@/story/story';
import { db } from '@/repository/Repository';
import { DialogAddRound } from '@/modules/rounds/components/DialogAddRound/DialogAddRound';
import { randomId } from '@mui/x-data-grid-generator';

import styles from './styles.module.scss';

export const RoundsController: FC = observer(() => {
  const [openDialogAdd, setOpenDialogAdd] = useState(false);

  const rounds = [...(story.competition?.rounds || [])].sort((a, b) => a.sort - b.sort);

  const selectedRound = useMemo(() => rounds.find((round) => round.selected), [rounds]);

  const handleSelectRound = useCallback(
    async (_id: string) => {
      if (story.competition) {
        await db.competition.update(
          { selected: true },
          {
            $set: {
              rounds: rounds.map((round) => ({ ...round, selected: round._id === _id }))
            }
          }
        );
        story.setCompetition(await db.competition.findOne({ _id: story.competition._id }));
      }
    },
    [rounds]
  );

  const handleOpenAddRound = useCallback(() => setOpenDialogAdd(true), []);
  const handleCloseDialogAdd = useCallback(() => setOpenDialogAdd(false), []);

  const handleAddRound = useCallback(
    async (name: string) => {
      if (story.competition && name) {
        await db.competition.update(
          { selected: true },
          {
            $set: {
              rounds: rounds.map((round, indx) => ({ ...round, selected: false, sort: indx }))
            }
          }
        );
        await db.competition.update(
          { selected: true },
          {
            $push: {
              rounds: {
                _id: randomId(),
                dateCreate: DateTime.now(),
                name,
                sort: rounds.length,
                selected: true
              }
            }
          }
        );
        story.setCompetition(await db.competition.findOne({ _id: story.competition._id }));
        handleCloseDialogAdd();
      }
    },
    [rounds, handleCloseDialogAdd]
  );

  return (
    <div className={styles.root}>
      <TabRounds
        rounds={rounds}
        selectedId={selectedRound?._id}
        onSelect={handleSelectRound}
        onAddRound={handleOpenAddRound}
      />
      <DialogAddRound open={openDialogAdd} onClose={handleCloseDialogAdd} onSave={handleAddRound} />
    </div>
  );
});
