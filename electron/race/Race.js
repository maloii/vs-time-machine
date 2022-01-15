const { lapDeleteByGroupId, lapsFindByMemberGroupId, lapInsert } = require('../repository/lapRepository');
const sound = require('sound-play');
const path = require('path');
const { DateTime } = require('luxon');
const { connector } = require('../Connector');
const { groupUpdate } = require('../repository/groupRepository');
const {
    getAllTranspondersAndColorInGroup,
    clearSearchTransponderInGroup,
    searchAndMarkTransponderInGroup,
    isAllSearchedTransponderInGroup,
    findMembersGroupByTransponder, findInMembersGroupSportsmanByTransponder
} = require('./groupUtils');
const _ = require('lodash');
const { sendToAllMessage } = require('../ipcMessages/sendMessage');
const { app } = require("electron");

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
    timerStop;

    start = async (group) => {
        connector.setRace(this);
        if (this.raceStatus === 'STOP') {
            connector.sendSyncTime();

            this.selectedGroup = { ...group };
            const round = this.selectedGroup.round || {};
            const count = await lapDeleteByGroupId(this.selectedGroup._id);
            sendToAllMessage('group-update-response', count);
            sendToAllMessage('group-in-race', this.selectedGroup);
            this.numberPackages = [];
            this.raceStatus = 'READY';
            this.sendRaceStatus();

            await sound.play(path.join(app.getPath('userData'), `/sounds/beep.wav`));
            await sound.play(path.join(app.getPath('userData'), `/sounds/beep.wav`));
            await sound.play(path.join(app.getPath('userData'), `/sounds/beep.wav`));

            this.raceStatus = 'RUN';
            this.startTime = DateTime.now().toMillis();
            this.sendRaceStatus(this.startTime);
            groupUpdate(this.selectedGroup._id, { timeStart: this.startTime }).then((count) => {
                sendToAllMessage('group-update-response', count);
            });
            //Если гонка с фиксированным временем пикаем когда достигнет время.
            if (round.maxTimeRace && Number(round.maxTimeRace) > 0) {
                const maxTimeRace = Number(round.maxTimeRace) * 1000;
                this.timerStop = setTimeout(() => {
                    if (round.typeRace !== 'FIXED_TIME_AND_ONE_LAP_AFTER') this.stop();
                    sound.play(path.join(app.getPath('userData'), `/sounds/long_beep.wav`));
                }, maxTimeRace);
            }

            this.lastTimeLap = {};
            (this.selectedGroup.sportsmen || []).forEach((membersGroup) => {
                this.lastTimeLap[membersGroup._id] = this.startTime;
            });
            (this.selectedGroup.teams || []).forEach((membersGroup) => {
                this.lastTimeLap[membersGroup._id] = this.startTime;
            });

            await sound.play(path.join(app.getPath('userData'), `/sounds/long_beep.wav`));
        }
    };

    stop = () => {
        connector.setRace(this);
        this.raceStatus = 'STOP';
        if (this.timerSearch) {
            clearInterval(this.timerSearch);
        }
        if (this.timerStop) {
            clearInterval(this.timerStop);
        }
        sendToAllMessage('race-status-message', this.raceStatus, this.selectedGroup);
    };

    search = async (group) => {
        connector.setRace(this);
        if (this.raceStatus === 'STOP') {
            this.raceStatus = 'SEARCH';
            this.sendRaceStatus();

            this.selectedGroup = clearSearchTransponderInGroup(group);
            const count = await groupUpdate(this.selectedGroup._id, this.selectedGroup);
            sendToAllMessage('group-update-response', count);
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

    newLap = async (millisecond, transponder, numberPackage, gateNumber) => {
        connector.setRace(this);
        if (this.raceStatus === 'RUN' && !this.numberPackages.includes(numberPackage)) {
            const membersGroup = findMembersGroupByTransponder(this.selectedGroup, transponder);
            const sportsman = findInMembersGroupSportsmanByTransponder(membersGroup, transponder);
            const competition = this.selectedGroup.competition || {};
            const round = this.selectedGroup.round || {};
            const gate = _.find(competition.gates, (gate) => {
                if (gate.number === gateNumber) {
                    return true;
                }
                return !gate.number && gate.type === 'FINISH';
            });
            if (membersGroup && gate) {
                const timeLap = millisecond - this.lastTimeLap[membersGroup._id];
                const gateDelay = gate.delay * 1000;
                let typeLap = (gateDelay > 0 && gateDelay < timeLap) || gateDelay === 0 ? 'OK' : 'HIDDEN';
                const laps = (await lapsFindByMemberGroupId(membersGroup._id, this.selectedGroup._id)) || [];

                //Проверка если указано максимальное время гонки
                if (round.maxTimeRace && Number(round.maxTimeRace) > 0) {
                    const maxTimeRace = Number(round.maxTimeRace) * 1000;
                    //Если время превышает максимальное время гонки то помечается HIDDEN
                    if (['FIXED_COUNT_LAPS', 'FIXED_TIME'].includes(round.typeRace)) {
                        if (millisecond - this.startTime >= maxTimeRace) typeLap = 'HIDDEN';
                        //При разрешенном долете круга все больше одного помечает HIDDEN
                    } else if (round.typeRace === 'FIXED_TIME_AND_ONE_LAP_AFTER') {
                        if (this.lastTimeLap[membersGroup._id] - this.startTime >= maxTimeRace) typeLap = 'HIDDEN';
                    }
                }
                //Проверка при фиксированном колличестве кругов. Если все круги пролетел то следующие помечаются как HIDDEN
                if (
                    round.typeRace === 'FIXED_COUNT_LAPS' &&
                    typeLap !== 'HIDDEN' &&
                    round.countLap &&
                    Number(round.countLap) > 0
                ) {
                    if (laps.filter((lap) => lap.typeLap === 'OK').length >= Number(round.countLap)) typeLap = 'HIDDEN';
                }

                if (
                    competition.skipFirstGate &&
                    laps.length === 0 &&
                    round.typeStartRace !== 'START_AFTER_FIRST_GATE'
                ) {
                    typeLap = 'SKIP_FIRST_GATE';
                }
                if (laps.length === 0 && round.typeStartRace === 'START_AFTER_FIRST_GATE') {
                    typeLap = 'START';
                }
                if (['OK', 'START', 'SKIP_FIRST_GATE'].includes(typeLap)) {
                    this.lastTimeLap[membersGroup._id] = millisecond;
                    setTimeout(() => {
                        sound.play(path.join(app.getPath('userData'), `/sounds/short_beep.wav`));
                    }, 0);
                }
                const count = await lapInsert({
                    millisecond,
                    timeLap,
                    typeLap,
                    competitionId: competition._id,
                    roundId: round._id,
                    groupId: this.selectedGroup._id,
                    gateId: gate._id,
                    memberGroupId: membersGroup._id,
                    sportsmanId: sportsman._id,
                    transponder
                });
                sendToAllMessage('group-update-response', count);
                this.numberPackages.push(numberPackage);
            }
        }
    };

    transponderHasBeenFound = (transponder) => {
        connector.setRace(this);
        if (this.raceStatus === 'SEARCH' && this.selectedGroup) {
            this.selectedGroup = searchAndMarkTransponderInGroup(this.selectedGroup, transponder);

            groupUpdate(this.selectedGroup._id, this.selectedGroup).then((count) => {
                sendToAllMessage('group-update-response', count);
            });
            if (isAllSearchedTransponderInGroup(this.selectedGroup)) {
                this.stop();
            }
        }
    };

    sendRaceStatus = (startTime) => {
        connector.setRace(this);
        sendToAllMessage('race-status-message', this.raceStatus, startTime);
    };
}

module.exports = { race: new Race() };
