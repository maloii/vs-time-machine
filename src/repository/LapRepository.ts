import { db } from '@/repository/Repository';
import { ILap } from '@/types/ILap';

export const lapsFindByGroupId = (groupId: string): Promise<Array<ILap>> => {
    return db.lap.find({ groupId });
};
