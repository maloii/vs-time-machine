import { ICompetition } from '@/types/ICompetition';

const { ipcRenderer } = window.require('electron');

export const loadCompetitionsAction = (): void => {
    ipcRenderer.send('load-competitions-request');
};

export const competitionInsertAction = (competition: Omit<ICompetition, '_id'>): void => {
    ipcRenderer.send('competition-insert-request', competition);
};

export const competitionUpdateAction = (
    _id: string,
    competition: Omit<ICompetition, '_id'> | Pick<ICompetition, 'logo'>
): void => {
    ipcRenderer.send('competition-update-request', _id, competition);
};

export const competitionDeleteAction = (_id: string): void => {
    ipcRenderer.send('competition-delete-request', _id);
};
