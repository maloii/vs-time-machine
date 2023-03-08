import { ICompetition } from '@/types/ICompetition';

export const loadCompetitionsAction = (): void => {
    window.api.ipcRenderer.send('load-competitions-request');
};

export const competitionInsertAction = (competition: Omit<ICompetition, '_id'>): void => {
    window.api.ipcRenderer.send('competition-insert-request', competition);
};

export const competitionUpdateAction = (
    _id: string,
    competition: Omit<ICompetition, '_id'> | Pick<ICompetition, 'logo'> | Pick<ICompetition, 'captureDeviceId'>
): void => {
    window.api.ipcRenderer.send('competition-update-request', _id, competition);
};

export const competitionDeleteAction = (_id: string): void => {
    window.api.ipcRenderer.send('competition-delete-request', _id);
};
