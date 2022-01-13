export const openCurrentGroupBroadCastAction = (): void => {
    window.api.ipcRenderer.send('open-current-group-broadcast-request');
};
