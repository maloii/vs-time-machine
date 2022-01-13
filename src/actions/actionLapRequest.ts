import _ from 'lodash';
import { IGroup } from '@/types/IGroup';
import { ILap } from '@/types/ILap';
import { IRound } from '@/types/IRound';

export const loadLapsForGroupAction = (group: IGroup): void => {
    window.api.ipcRenderer.send('load-laps-for-group-request', group._id);
};

export const loadLapsForRoundAction = (round: IRound): Promise<Array<ILap>> => {
    return window.api.ipcRenderer.invoke('handle-load-laps-for-round-request', round._id);
};

export const loadLapsForRoundsAction = (rounds: IRound[]): Promise<Array<ILap>> => {
    return window.api.ipcRenderer.invoke(
        'handle-load-laps-for-rounds-request',
        _.cloneDeep(rounds || []).map((round) => round._id)
    );
};

export const lapUpdateAction = (_id: string, lap: Pick<ILap, 'typeLap'>): void => {
    window.api.ipcRenderer.send('lap-update-request', _id, lap);
};

export const lapDeleteAction = (_id: string): void => {
    window.api.ipcRenderer.send('lap-delete-request', _id);
};
