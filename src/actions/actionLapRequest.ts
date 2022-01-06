import { IGroup } from '@/types/IGroup';
import { ILap } from '@/types/ILap';

export const loadLapsForGroupAction = (group: IGroup): void => {
    window.api.ipcRenderer.send('load-laps-for-group-request', group._id);
};

export const lapUpdateAction = (_id: string, lap: Pick<ILap, 'typeLap'>): void => {
    window.api.ipcRenderer.send('lap-update-request', _id, lap);
};

export const lapDeleteAction = (_id: string): void => {
    window.api.ipcRenderer.send('lap-delete-request', _id);
};
