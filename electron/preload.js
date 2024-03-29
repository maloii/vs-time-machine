const { contextBridge, ipcRenderer } = require('electron');
const { positionCalculation, groupLapsByMemberGroup } = require('./race/positionCalculation');
const { competitionColorAndChannel } = require('./utils/competitionColorAndChannel');
const {
    IMAGES_FOLDER,
    DEFAULT_PHOTO,
    DEFAULT_COMPETITION_LOGO,
    getFilePath,
    copyFile,
    saveFile,
    deleteFile
} = require('./utils/fileUtils');

const API = {
    IMAGES_FOLDER,
    DEFAULT_PHOTO,
    DEFAULT_COMPETITION_LOGO,
    getFilePath: (file) => getFilePath(file),
    copyFile: (file) => copyFile(file),
    saveFile: (fileName, blob) => saveFile(fileName, blob),
    deleteFile: (file) => deleteFile(file),
    platform: process.platform,
    ipcRenderer: {
        on: (channel, ...data) => ipcRenderer.on(channel, ...data),
        send: (channel, ...data) => ipcRenderer.send(channel, ...data),
        removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
        invoke: (channel, ...data) => ipcRenderer.invoke(channel, ...data)
    },
    positionCalculation: (round, group, groupedLaps) => positionCalculation(round, group, groupedLaps),
    groupLapsByMemberGroup: (group, laps, withPitStop) => groupLapsByMemberGroup(group, laps, withPitStop),
    competitionColorAndChannel: (position, competition) => competitionColorAndChannel(position, competition)
};

contextBridge.exposeInMainWorld('api', API);
