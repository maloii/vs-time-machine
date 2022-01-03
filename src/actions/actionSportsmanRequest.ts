import { ICompetition } from '@/types/ICompetition';
import { ISportsman } from '@/types/ISportsman';
const { ipcRenderer } = window.require('electron');

export const loadSportsmenAction = (competition: ICompetition): void => {
    ipcRenderer.send('load-sportsmen-for-competition-request', competition._id);
};

export const sportsmanInsertAction = (sportsman: Omit<ISportsman, '_id'>): void => {
    ipcRenderer.send('sportsman-insert-request', sportsman);
};

export const sportsmanUpdateAction = (
    _id: string,
    sportsman: Omit<ISportsman, '_id' | 'competitionId'> | Pick<ISportsman, 'photo'>
): void => {
    ipcRenderer.send('sportsman-update-request', _id, sportsman);
};

export const sportsmanDeleteAction = (_id: string): void => {
    ipcRenderer.send('sportsman-delete-request', _id);
};
