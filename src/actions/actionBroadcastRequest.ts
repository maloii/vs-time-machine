import { IBroadCast } from '@/types/IBroadCast';

export const openWindowBroadCastAction = (id: string): void => {
    window.api.ipcRenderer.send('open-window-broadcast-request', id);
};

export const loadReportsAction = (): void => {
    window.api.ipcRenderer.send('load-reports-request');
};

export const handleLoadBroadCastsAction = (): Promise<Array<IBroadCast>> => {
    return window.api.ipcRenderer.invoke('handle-load-broadcast-request');
};

export const handleLoadBroadCastByIdAction = (id: string): Promise<IBroadCast> => {
    return window.api.ipcRenderer.invoke('handle-load-broadcast-request-by-id', id);
};

export const handleBroadCastInsertAction = (broadCast: Omit<IBroadCast, '_id'>): Promise<IBroadCast> => {
    return window.api.ipcRenderer.invoke('handle-broadcast-insert-request', broadCast);
};

export const handleBroadCastUpdateAction = (_id: string, broadCast: Omit<IBroadCast, '_id'>): Promise<number> => {
    return window.api.ipcRenderer.invoke('handle-broadcast-update-request', _id, broadCast);
};

export const handlebroadCastDeleteAction = (_id: string): Promise<number> => {
    return window.api.ipcRenderer.invoke('handle-broadcast-delete-request', _id);
};
