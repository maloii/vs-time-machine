import { IRound } from '@/types/IRound';
import { IGroup } from '@/types/IGroup';

const { ipcRenderer } = window.require('electron');

export const loadGroupsAction = (round: IRound): void => {
    ipcRenderer.send('load-groups-for-round-request', round._id);
};

export const groupInsertAction = (group: Omit<IGroup, '_id'>): void => {
    ipcRenderer.send('group-insert-request', group);
};

export const groupUpdateAction = (_id: string, group: Omit<IGroup, '_id' | 'competitionId'>): void => {
    ipcRenderer.send('group-update-request', _id, group);
};

export const groupSelectAction = (roundId: string, _id: string): void => {
    ipcRenderer.send('group-select-request', roundId, _id);
};

export const groupDeleteAction = (_id: string): void => {
    ipcRenderer.send('group-delete-request', _id);
};
