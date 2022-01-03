const { contextBridge, ipcRenderer } = require('electron');

const {
    IMAGES_FOLDER,
    DEFAULT_PHOTO,
    DEFAULT_COMPETITION_LOGO,
    getFilePath,
    copyFile,
    deleteFile
} = require('./utils/fileUtils');

const API = {
    IMAGES_FOLDER,
    DEFAULT_PHOTO,
    DEFAULT_COMPETITION_LOGO,
    getFilePath: (file) => getFilePath(file),
    copyFile: (file) => copyFile(file),
    deleteFile: (file) => deleteFile(file),
    ipcRenderer: {
        on: (channel, ...data) => ipcRenderer.on(channel, ...data),
        send: (channel, ...data) => ipcRenderer.send(channel, ...data),
        removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
        invoke: (channel, ...data) => ipcRenderer.invoke(channel, ...data)
    }
};

contextBridge.exposeInMainWorld('api', API);
