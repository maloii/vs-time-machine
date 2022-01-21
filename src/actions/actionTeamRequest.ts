import { ICompetition } from '@/types/ICompetition';
import { ITeam } from '@/types/ITeam';

export const loadTeamsAction = (competition: ICompetition): void => {
    window.api.ipcRenderer.send('load-teams-for-competition-request', competition._id);
};

export const teamInsertAction = (team: Omit<ITeam, '_id'>): void => {
    window.api.ipcRenderer.send('team-insert-request', team);
};

export const teamUpdateAction = (
    _id: string,
    team: Omit<ITeam, '_id' | 'competitionId'> | Pick<ITeam, 'photo'>
): void => {
    window.api.ipcRenderer.send('team-update-request', _id, team);
};

export const teamDeleteAction = (_id: string): Promise<number> => {
    return window.api.ipcRenderer.invoke('team-delete-request', _id);
};
