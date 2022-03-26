import { IBroadCast } from '@/types/IBroadCast';

export const openWindowBroadCastAction = (id: string): void => {
    window.api.ipcRenderer.send('open-window-broadcast-request', id);
};

export const loadBroadCastsAction = (competitionId: string): void => {
    window.api.ipcRenderer.send('load-broadcast-request', competitionId);
};

export const handleLoadBroadCastsAction = (competitionId: string): Promise<Array<IBroadCast>> => {
    return window.api.ipcRenderer.invoke('handle-load-broadcast-request', competitionId);
};

export const handleLoadBroadCastByIdAction = (id: string): Promise<IBroadCast> => {
    return window.api.ipcRenderer.invoke('handle-load-broadcast-request-by-id', id);
};

export const broadCastInsertAction = (broadCast: Omit<IBroadCast, '_id'>): void => {
    window.api.ipcRenderer.send('broadcast-insert-request', broadCast);
};

export const handleBroadCastInsertAction = (broadCast: Omit<IBroadCast, '_id'>): Promise<IBroadCast> => {
    return window.api.ipcRenderer.invoke('handle-broadcast-insert-request', broadCast);
};

export const broadCastUpdateAction = (
    _id: string,
    broadCast: Omit<IBroadCast, '_id' | 'competitionId'> | Pick<IBroadCast, 'background'>
): void => {
    window.api.ipcRenderer.send('broadcast-update-request', _id, broadCast);
};

export const handleBroadCastUpdateAction = (
    _id: string,
    broadCast: Omit<IBroadCast, '_id' | 'competitionId'> | Pick<IBroadCast, 'background'>
): Promise<number> => {
    return window.api.ipcRenderer.invoke('handle-broadcast-update-request', _id, broadCast);
};

export const broadCastDeleteAction = (_id: string): void => {
    window.api.ipcRenderer.send('broadcast-delete-request', _id);
};

export const handleBroadCastDeleteAction = (_id: string): Promise<number> => {
    return window.api.ipcRenderer.invoke('handle-broadcast-delete-request', _id);
};
