import { IGroup } from '@/types/IGroup';
const { ipcRenderer } = window.require('electron');

export const loadLapsForGroupAction = (group: IGroup): void => {
    ipcRenderer.send('load-laps-for-group-request', group._id);
};
