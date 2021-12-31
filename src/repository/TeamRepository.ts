import { db } from '@/repository/Repository';
import { ITeam } from '@/types/ITeam';

export const teamInsert = (team: Omit<ITeam, '_id'>): Promise<ITeam> => {
    return db.team.insert(team);
};

export const teamUpdate = (_id: string, team: Omit<ITeam, '_id' | 'competitionId'>): Promise<number> => {
    return db.team.update(
        { _id },
        {
            $set: {
                ...team
            }
        }
    );
};

export const teamDelete = (_id: string): Promise<number> => {
    return db.team.remove({ _id }, {});
};
