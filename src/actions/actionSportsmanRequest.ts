import { ICompetition } from '@/types/ICompetition';
import { ISportsman } from '@/types/ISportsman';

export const loadSportsmenAction = (competition: ICompetition): void => {
    window.api.ipcRenderer.send('load-sportsmen-for-competition-request', competition._id);
};

export const sportsmanInsertAction = (sportsman: Omit<ISportsman, '_id'>): void => {
    window.api.ipcRenderer.send('sportsman-insert-request', sportsman);
};

export const sportsmanUpdateAction = (
    _id: string,
    sportsman: Omit<ISportsman, '_id' | 'competitionId'> | Pick<ISportsman, 'photo'>
): void => {
    window.api.ipcRenderer.send('sportsman-update-request', _id, sportsman);
};

export const sportsmanDeleteAction = (_id: string): void => {
    window.api.ipcRenderer.send('sportsman-delete-request', _id);
};
