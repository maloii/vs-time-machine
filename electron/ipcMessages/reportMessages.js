const { reportFindAll, reportInsert, reportUpdate, reportDelete } = require('../repository/reportRepository');
const { ipcMain } = require('electron');

ipcMain.on('load-reports-request', async (e) => {
    const reports = await reportFindAll();
    e.reply('load-reports-response', reports);
});

ipcMain.on('report-insert-request', async (e, report) => {
    const count = await reportInsert(report);
    e.reply('report-insert-response', count);
});

ipcMain.on('report-update-request', async (e, _id, report) => {
    const count = await reportUpdate(_id, report);
    e.reply('report-update-response', count);
});

ipcMain.on('report-delete-request', async (e, _id) => {
    const count = await reportDelete(_id);
    e.reply('report-delete-response', count);
});
