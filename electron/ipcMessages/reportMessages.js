const { reportFindAll, reportInsert, reportUpdate, reportDelete } = require('../repository/reportRepository');
const { ipcMain } = require('electron');
const { sendToAllMessage } = require('./sendMessage');

ipcMain.on('load-reports-request', async (e) => {
    const reports = await reportFindAll();
    e.reply('load-reports-response', reports);
});

ipcMain.handle('handle-load-reports-request', (e) => {
    return reportFindAll();
});

ipcMain.on('report-insert-request', async (e, report) => {
    const count = await reportInsert(report);
    sendToAllMessage('report-insert-response', count);
});

ipcMain.on('report-update-request', async (e, _id, report) => {
    const count = await reportUpdate(_id, report);
    sendToAllMessage('report-update-response', count);
});

ipcMain.on('report-delete-request', async (e, _id) => {
    const count = await reportDelete(_id);
    sendToAllMessage('report-delete-response', count);
});
