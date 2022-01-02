import { ICompetition } from '@/types/ICompetition';
import { ITeam } from '@/types/ITeam';
const { ipcRenderer } = window.require('electron');

export const loadTeamsAction = (competition: ICompetition): void => {
    ipcRenderer.send('load-teams-for-competition-request', competition._id);
};

export const teamInsertAction = (team: Omit<ITeam, '_id'>): void => {
    ipcRenderer.send('team-insert-request', team);
};

export const teamUpdateAction = (_id: string, team: Omit<ITeam, '_id' | 'competitionId'>): void => {
    ipcRenderer.send('team-update-request', _id, team);
};

export const teamDeleteAction = (_id: string): void => {
    ipcRenderer.send('team-delete-request', _id);
};
