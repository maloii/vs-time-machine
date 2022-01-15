const sendToAllMessage = (channel, ...message) => {
    Object.values(global.windows).forEach((item) => {
        item.webContents.send(channel, ...message);
    });
};

module.exports = { sendToAllMessage };
