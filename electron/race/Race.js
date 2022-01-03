const { lapDeleteByGroupId } = require('../repository/lapRepository');
const sound = require('sound-play');
const path = require('path');
const { DateTime } = require('luxon');
const { connector } = require('../Connector');

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Race {
    // READY,
    // RUN,
    // STOP,
    // SEARCH
    raceStatus = 'STOP';
    startTime;
    selectedGroup = undefined;

    numberPackages = [];
    lastTimeLap = {};

    start = async (group) => {
        if (this.raceStatus === 'STOP') {
            connector.sendSyncTime();

            this.selectedGroup = { ...group };
            await lapDeleteByGroupId(this.selectedGroup._id);

            this.numberPackages = [];
            this.raceStatus = 'READY';
            if (global.mainWindow) {
                global.mainWindow.webContents.send('race-status-message', this.raceStatus);
            }

            await sound.play(path.join(__dirname, `../../assets/beep.wav`));
            await sound.play(path.join(__dirname, `../../assets/beep.wav`));
            await sound.play(path.join(__dirname, `../../assets/beep.wav`));
            this.startTime = DateTime.now().toMillis();
            await sound.play(path.join(__dirname, `../../assets/long_beep.wav`));
        }
    };

    stop = () => {
        this.raceStatus = 'STOP';
        if (global.mainWindow) {
            global.mainWindow.webContents.send('race-status-message', this.raceStatus);
        }
    };
}

module.exports = { race: new Race() };
