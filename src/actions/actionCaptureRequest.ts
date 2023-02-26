export const captureSaveAction = (buffer: Buffer | any): void => {
    window.api.ipcRenderer.send('capture-save-request', buffer);
};

export const showFileInFolderAction = (path: string): void => {
    window.api.ipcRenderer.send('show-file-in-folder', path);
};
