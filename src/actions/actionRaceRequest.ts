import { IGroup } from '@/types/IGroup';

export const startRaceAction = (group: IGroup): void => {
    window.api.ipcRenderer.send('race-start-request', group);
};

export const stopRaceAction = (): void => {
    window.api.ipcRenderer.send('race-stop-request');
};
