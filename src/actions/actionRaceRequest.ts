import { IGroup } from '@/types/IGroup';
import { TypeRaceStatus } from '@/types/TypeRaceStatus';

export const startRaceAction = (group: IGroup): void => {
    window.api.ipcRenderer.send('race-start-request', group);
};

export const startSearchAction = (group: IGroup): void => {
    window.api.ipcRenderer.send('search-start-request', group);
};

export const stopRaceAction = (): void => {
    window.api.ipcRenderer.send('race-stop-request');
};

export const getStartTimeAction = (): Promise<number> => {
    return window.api.ipcRenderer.invoke('handle-race-start-time-request');
};

export const getRaceStatusAction = (): Promise<TypeRaceStatus> => {
    return window.api.ipcRenderer.invoke('handle-race-status-request');
};
