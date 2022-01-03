import { IGroup } from '@/types/IGroup';

export const loadLapsForGroupAction = (group: IGroup): void => {
    window.api.ipcRenderer.send('load-laps-for-group-request', group._id);
};
