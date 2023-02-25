export const captureSaveAction = (buffer: Buffer | any): void => {
    window.api.ipcRenderer.send('capture-save-request', buffer);
};
