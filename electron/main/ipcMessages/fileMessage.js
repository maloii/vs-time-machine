const { ipcMain, app } = require('electron');

ipcMain.handle('get-path-user-data-handle', async (e, file) => {
    return app.getPath('userData');
});
