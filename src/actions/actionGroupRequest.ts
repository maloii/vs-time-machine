import { IRound } from '@/types/IRound';
import { IGroup } from '@/types/IGroup';

export const loadGroupsByRoundIdAction = (roundId: string): void => {
    window.api.ipcRenderer.send('load-groups-for-round-request', roundId);
};

export const loadGroupsByRoundAction = (roundId: string): Promise<Array<IGroup>> => {
    return window.api.ipcRenderer.invoke('handle-load-groups-for-round-request', roundId);
};

export const loadGroupsByRoundsAction = (rounds: IRound[]): Promise<Array<IGroup>> => {
    return window.api.ipcRenderer.invoke(
        'handle-load-groups-for-rounds-request',
        (rounds || []).map((round) => round._id)
    );
};

export const loadGroupByIdAction = (_id: string): Promise<IGroup> => {
    return window.api.ipcRenderer.invoke('handle-load-group-by-id-request', _id);
};

export const groupInsertAction = (group: Omit<IGroup, '_id'>): void => {
    window.api.ipcRenderer.send('group-insert-request', group);
};

export const loadGroupsByCompetitionIdAction = (competitionId: string): void => {
    return window.api.ipcRenderer.invoke('handle-groups-for-competition-request', competitionId);
};

export const groupUpdateAction = (
    _id: string,
    group:
        | Omit<IGroup, '_id' | 'competitionId'>
        | Omit<IGroup, '_id' | 'competitionId' | 'roundId' | 'close' | 'sort' | 'timeStart'>
): void => {
    window.api.ipcRenderer.send('group-update-request', _id, group);
};

export const groupSelectAction = (roundId: string, _id: string): void => {
    window.api.ipcRenderer.send('group-select-request', roundId, _id);
};

export const groupDeleteAction = (_id: string): void => {
    window.api.ipcRenderer.send('group-delete-request', _id);
};
