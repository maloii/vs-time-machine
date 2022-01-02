import { ICompetition } from '@/types/ICompetition';
import { IRound } from '@/types/IRound';

const { ipcRenderer } = window.require('electron');

export const loadRoundsAction = (competition: ICompetition): void => {
    ipcRenderer.send('load-rounds-for-competition-request', competition._id);
};

export const roundInsertAction = (
    competitionId: string,
    round: Omit<IRound, '_id' | 'competitionId' | 'selected' | 'dateCreate' | 'minTimeLap' | 'close' | 'sort'>
): void => {
    ipcRenderer.send('round-insert-request', competitionId, round);
};

export const roundUpdateAction = (
    _id: string,
    round: Omit<IRound, '_id' | 'competitionId' | 'selected' | 'dateCreate' | 'minTimeLap' | 'close' | 'sort'>
): void => {
    ipcRenderer.send('round-update-request', _id, round);
};

export const roundSelectAction = (competitionId: string, _id: string): void => {
    ipcRenderer.send('round-select-request', competitionId, _id);
};

export const roundDeleteAction = (_id: string): void => {
    ipcRenderer.send('round-delete-request', _id);
};
