import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Table } from '@/modules/sportsmen/components/table/Table';
import { story } from '@/story/story';
import { db } from '@/repository/Repository';
import { randomId } from '@mui/x-data-grid-generator';
import { DateTime } from 'luxon';
import { ISportsman } from '@/types/ISportsman';

import styles from './styles.module.scss';

export const SportsmenController: FC = observer(() => {
  const handleAddSportsman = useCallback(async () => {
    if (story.competition) {
      await db.competition.update(
        { selected: true },
        {
          $push: {
            sportsmen: {
              _id: randomId(),
              dateCreate: DateTime.now(),
              firstName: '',
              lastName: '',
              middleName: ''
            }
          }
        }
      );
      story.setCompetition(await db.competition.findOne({ _id: story.competition._id }));
    }
  }, []);

  const handleEditSportsmen = useCallback(async (sportsmen: ISportsman[]) => {
    if (story.competition) {
      await db.competition.update(
        { selected: true },
        {
          $set: {
            sportsmen
          }
        }
      );
      story.setCompetition(await db.competition.findOne({ _id: story.competition._id }));
    }
  }, []);

  const handleDeleteSportsmen = useCallback(async (_id: string) => {
    if (story.competition) {
      await db.competition.update(
        { selected: true },
        {
          $set: {
            sportsmen: [...story.competition.sportsmen].filter((item) => item._id !== _id)
          }
        }
      );
      story.setCompetition(await db.competition.findOne({ _id: story.competition._id }));
    }
  }, []);

  if (!story.competition) return null;

  return (
    <div className={styles.root}>
      <Table
        sportsmen={[...story.competition.sportsmen]}
        onAddSportsman={handleAddSportsman}
        onEditSportsmen={handleEditSportsmen}
        onDeleteSportsmen={handleDeleteSportsmen}
      />
    </div>
  );
});
