import { db } from '@/repository/Repository';
import { IGroup } from '@/types/IGroup';

export const groupsFindByRoundId = (roundId: string): Promise<Array<IGroup>> => {
    return db.group.find({ roundId });
};

export const groupInsert = (group: Omit<IGroup, '_id'>): Promise<IGroup> => {
    return db.group.insert(group);
};

export const groupUpdate = (_id: string, group: Omit<IGroup, '_id' | 'competitionId'>): Promise<number> => {
    return db.group.update(
        { _id },
        {
            $set: {
                ...group
            }
        }
    );
};

export const groupSelect = async (roundId: string, _id: string): Promise<number> => {
    await db.group.update({ roundId }, { $set: { selected: false } }, { multi: true });
    return db.group.update({ _id }, { $set: { selected: true } });
};

export const groupDelete = (_id: string): Promise<number> => {
    return db.group.remove({ _id }, {});
};
