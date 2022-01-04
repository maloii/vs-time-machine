const { lapDeleteByGroupId } = require('../repository/lapRepository');
const sound = require('sound-play');
const path = require('path');
const { DateTime } = require('luxon');
const { connector } = require('../Connector');
const { groupUpdate } = require('../repository/groupRepository');
const {
    getAllTranspondersAndColorInGroup,
    clearSearchTransponderInGroup,
    searchAndMarkTransponderInGroup,
    isAllSearchedTransponderInGroup
} = require('./groupUtils');

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
    timerSearch;

    start = async (group) => {
        connector.setRace(this);
        if (this.raceStatus === 'STOP') {
            connector.sendSyncTime();

            this.selectedGroup = { ...group };
            await lapDeleteByGroupId(this.selectedGroup._id);

            this.numberPackages = [];
            this.raceStatus = 'READY';
            this.sendRaceStatus();

            await sound.play(path.join(__dirname, `../../assets/beep.wav`));
            await sound.play(path.join(__dirname, `../../assets/beep.wav`));
            await sound.play(path.join(__dirname, `../../assets/beep.wav`));
            this.startTime = DateTime.now().toMillis();
            await sound.play(path.join(__dirname, `../../assets/long_beep.wav`));
        }
    };

    stop = () => {
        connector.setRace(this);
        this.raceStatus = 'STOP';
        if (this.timerSearch) {
            clearInterval(this.timerSearch);
        }
        if (global.mainWindow) {
            global.mainWindow.webContents.send('race-status-message', this.raceStatus);
        }
    };

    search = async (group) => {
        connector.setRace(this);
        if (this.raceStatus === 'STOP') {
            this.raceStatus = 'SEARCH';
            this.sendRaceStatus();

            this.selectedGroup = clearSearchTransponderInGroup(group);
            const count = await groupUpdate(this.selectedGroup._id, this.selectedGroup);
            if (global.mainWindow) {
                global.mainWindow.webContents.send('group-update-response', count);
            }
            this.timerSearch = setInterval(() => {
                const transponders = getAllTranspondersAndColorInGroup(this.selectedGroup);
                (transponders || []).forEach((transponder) => {
                    let colorVsCode = transponder.color;
                    colorVsCode |= 1 << 6;
                    connector.send(`searchtrans:${transponder.transponder},${colorVsCode}`);
                });
            }, 1000);
        }
    };

    newLap = (lapTime, transponder, numberPackage) => {};

    transponderHasBeenFound = (transponder) => {
        connector.setRace(this);
        if (this.raceStatus === 'SEARCH' && this.selectedGroup) {
            this.selectedGroup = searchAndMarkTransponderInGroup(this.selectedGroup, transponder);

            groupUpdate(this.selectedGroup._id, this.selectedGroup).then((count) => {
                if (global.mainWindow) {
                    global.mainWindow.webContents.send('group-update-response', count);
                }
            });
            if (isAllSearchedTransponderInGroup(this.selectedGroup)) {
                this.stop();
            }
        }
    };

    sendRaceStatus = () => {
        connector.setRace(this);
        if (global.mainWindow) {
            global.mainWindow.webContents.send('race-status-message', this.raceStatus);
        }
    };
}

module.exports = { race: new Race() };
