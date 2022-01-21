import { IBroadCast } from '@/types/IBroadCast';

export const openWindowBroadCastAction = (id: string): void => {
    window.api.ipcRenderer.send('open-window-broadcast-request', id);
};

export const loadBroadCastsAction = (): Promise<Array<IBroadCast>> => {
    return window.api.ipcRenderer.invoke('load-broadcast-request');
};

export const loadBroadCastByIdAction = (id: string): Promise<IBroadCast> => {
    return window.api.ipcRenderer.invoke('load-broadcast-request-by-id', id);
};

export const broadCastInsertAction = (broadCast: Omit<IBroadCast, '_id'>): Promise<IBroadCast> => {
    return window.api.ipcRenderer.invoke('broadcast-insert-request', broadCast);
};

export const broadCastUpdateAction = (_id: string, broadCast: Omit<IBroadCast, '_id'>): Promise<number> => {
    return window.api.ipcRenderer.invoke('broadcast-update-request', _id, broadCast);
};

export const broadCastDeleteAction = (_id: string): Promise<number> => {
    return window.api.ipcRenderer.invoke('broadcast-delete-request', _id);
};
