const { app, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { race } = require('../race/Race');
const { groupUpdate } = require('../repository/groupRepository');
const { sendToAllMessage } = require('./sendMessage');
const { DateTime } = require('luxon');
const { VIDEOS_FOLDER } = require('../init');

ipcMain.on('capture-save-request', async (e, buffer) => {
    const file = path.join(
        app.getPath('userData'),
        `/${VIDEOS_FOLDER}/${race.selectedGroup._id}-${DateTime.now().toFormat('dd.MM.yyyy_HH.mm.ss')}.webm`
    );
    fs.writeFile(file, buffer, async (err) => {
        if (err) {
            console.error('Failed to save video ' + err);
        } else {
            const count = await groupUpdate(race.selectedGroup._id, { videoSrc: file });
            sendToAllMessage('group-update-response', count);
            console.log('Saved video: ' + file);
        }
    });
});

ipcMain.on('show-file-in-folder', async (e, path) => {
    shell.showItemInFolder(path);
});
