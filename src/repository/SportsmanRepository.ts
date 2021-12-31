import { db } from '@/repository/Repository';
import { ISportsman } from '@/types/ISportsman';

export const sportsmanInsert = (sportsman: Omit<ISportsman, '_id'>): Promise<ISportsman> => {
    return db.sportsman.insert(sportsman);
};

export const sportsmanUpdate = (_id: string, sportsman: Omit<ISportsman, '_id' | 'competitionId'>): Promise<number> => {
    return db.sportsman.update(
        { _id },
        {
            $set: {
                ...sportsman
            }
        }
    );
};

export const sportsmanDelete = (_id: string): Promise<number> => {
    return db.sportsman.remove({ _id }, {});
};
