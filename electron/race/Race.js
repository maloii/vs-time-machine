const { app } = require('electron');
const sound = require('node-wav-player');
const path = require('path');
const { Worker } = require('worker_threads');
const { DateTime } = require('luxon');
const { speech } = require('../speech/speech');
const { connector } = require('../Connector');
const { groupUpdate, groupSavePositions, groupFindById } = require('../repository/groupRepository');
const {
    getAllTranspondersAndColorInGroup,
    clearSearchTransponderInGroup,
    searchAndMarkTransponderInGroup,
    isAllSearchedTransponderInGroup,
    findMembersGroupByTransponder,
    findInMembersGroupSportsmanByTransponder,
    getAllNameMembersInGroup,
    getNameMemberInGroup,
    clearPositionInGroup
} = require('./groupUtils');
const _ = require('lodash');
const { sendToAllMessage } = require('../ipcMessages/sendMessage');
const { lapDeleteByGroupId, lapsFindByMemberGroupId, lapInsert } = require('../repository/lapRepository');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    lastTimePitStopBegin = {};
    lastTimePitStopEnd = {};
    lastTimeGates = {};
    timerSearch;
    timerStop;
    timersSayTime = [];

    invitation = async (group) => {
        this.selectedGroup = group;
        sendToAllMessage('group-in-race', this.selectedGroup);
        const text = `На старт приглашается ${group.name}. ${getAllNameMembersInGroup(group).join(', ')}`;
        speech(text);
    };

    sayTimeLeft = (maxTimeRace) => {
        let indexTimer = 0;
        if (maxTimeRace >= 1000 * 60) {
            this.timersSayTime[indexTimer++] = setTimeout(() => {
                speech('десять секунд');
            }, maxTimeRace - 1000 * 10);
            this.timersSayTime[indexTimer++] = setTimeout(() => {
                speech('тридцать секунд');
            }, maxTimeRace - 1000 * 30);
        }
        if (maxTimeRace >= 1000 * 60 * 2) {
            this.timersSayTime[indexTimer++] = setTimeout(() => {
                speech('До конца гонки осталась одна минута');
            }, maxTimeRace - 1000 * 60);
        }
        if (maxTimeRace >= 1000 * 60 * 9) {
            this.timersSayTime[indexTimer++] = setTimeout(() => {
                speech('До конца гонки осталась пять минут');
            }, maxTimeRace - 1000 * 60 * 5);
        }

        if (maxTimeRace >= 1000 * 60 * 15) {
            this.timersSayTime[indexTimer++] = setTimeout(() => {
                speech('До конца гонки осталась десять минут');
            }, maxTimeRace - 1000 * 60 * 10);
        }
    };

    start = async (group) => {
        connector.setRace(this);
        if (this.raceStatus === 'STOP') {
            this.clear();
            connector.sendSyncTime();
            this.selectedGroup = clearPositionInGroup(group);
            let count = await groupUpdate(this.selectedGroup._id, this.selectedGroup);
            const round = this.selectedGroup.round || {};
            count += await lapDeleteByGroupId(this.selectedGroup._id);
            sendToAllMessage('group-update-response', count);
            sendToAllMessage('group-in-race', this.selectedGroup);
            this.numberPackages = [];
            this.raceStatus = 'READY';
            this.sendRaceStatus();
            speech('10 секунд до старта.');
            await sleep(8000);
            speech('Удачной гонки!');
            await sleep(1500);
            this.raceStatus = 'COUNTDOWN_3';
            this.sendRaceStatus();
            await sound.play({ path: path.join(app.getPath('userData'), `/sounds/beep.wav`) });
            await sleep(200);
            this.raceStatus = 'COUNTDOWN_2';
            this.sendRaceStatus();
            await sound.play({ path: path.join(app.getPath('userData'), `/sounds/beep.wav`) });
            await sleep(200);
            this.raceStatus = 'COUNTDOWN_1';
            this.sendRaceStatus();
            await sound.play({ path: path.join(app.getPath('userData'), `/sounds/beep.wav`) });
            await sleep(400);

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
                    sound.play({ path: path.join(app.getPath('userData'), `/sounds/long_beep.wav`) });
                    speech('Гонка завершена!');
                }, maxTimeRace);
                this.sayTimeLeft(maxTimeRace);
            }

            this.lastTimeLap = {};
            this.lastTimePitStopBegin = {};
            this.lastTimeGates = {};
            (this.selectedGroup.sportsmen || []).forEach((membersGroup) => {
                this.lastTimeLap[membersGroup._id] = this.startTime;
            });
            (this.selectedGroup.teams || []).forEach((membersGroup) => {
                this.lastTimeLap[membersGroup._id] = this.startTime;
            });

            await sound.play({ path: path.join(app.getPath('userData'), `/sounds/long_beep.wav`) });
        }
    };

    stop = () => {
        connector.setRace(this);
        this.raceStatus = 'STOP';
        this.clear();
        this.sendRaceStatus();
    };

    clear = () => {
        if (this.timerSearch) {
            clearInterval(this.timerSearch);
        }
        if (this.timerStop) {
            clearInterval(this.timerStop);
        }
        if (this.timersSayTime?.length > 0) {
            for (const timerToClear of this.timersSayTime) {
                clearInterval(timerToClear);
            }
            this.timersSayTime = [];
        }
    };

    search = async (group) => {
        connector.setRace(this);
        if (this.raceStatus === 'STOP') {
            this.raceStatus = 'SEARCH';
            this.sendRaceStatus();

            this.selectedGroup = clearSearchTransponderInGroup(group);
            const count = await groupUpdate(this.selectedGroup._id, this.selectedGroup);
            sendToAllMessage('group-in-race', this.selectedGroup);
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
            let gate = _.find(competition.gates, (gate) => Number(gate.number) === Number(gateNumber));
            if (!gate) {
                gate = _.find(competition.gates, (gate) => gate.type === 'FINISH' && gate.number === undefined);
            }
            if (!gate) {
                const newLap = await lapInsert({
                    millisecond,
                    timeLap: undefined,
                    typeLap: 'HIDDEN',
                    competitionId: competition._id,
                    roundId: round._id,
                    groupId: this.selectedGroup._id,
                    gateId: 'NOT_FOUND',
                    gateNumber,
                    memberGroupId: membersGroup._id,
                    sportsmanId: sportsman._id,
                    transponder
                });
                sendToAllMessage('new-lap-update', newLap);
                return;
            }
            const gates = (competition.gates || [])
                .filter((item) => item.type === 'GATE')
                .sort((a, b) => a.position - b.position);

            const gateDelay = gate.delay * 1000;

            if (membersGroup && gate?.type === 'FINISH') {
                const laps = (await lapsFindByMemberGroupId(membersGroup._id, this.selectedGroup._id)) || [];
                const okLaps = laps.filter((lap) => lap.typeLap === 'OK');
                const timeLap = millisecond - this.lastTimeLap[membersGroup._id];
                this.lastTimePitStopBegin[membersGroup._id] = undefined;
                let typeLap = (gateDelay > 0 && gateDelay < timeLap) || gateDelay === 0 ? 'OK' : 'HIDDEN';
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
                    if (okLaps.length >= Number(round.countLap)) typeLap = 'HIDDEN';
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

                if (typeLap === 'OK' && gates.length > 0) {
                    if (
                        gates.reduce((res, curr) => !!this.lastTimeGates?.[membersGroup._id]?.[curr._id] && res, true)
                    ) {
                        this.lastTimeGates[membersGroup._id] = {};
                    } else {
                        typeLap = 'HIDDEN';
                        if (competition.playFail) {
                            //runServicePlay('fail.mp3');
                            speech(`${sportsman.nick} мимо!`);
                        }
                    }
                }

                if (['OK', 'START', 'SKIP_FIRST_GATE'].includes(typeLap)) {
                    this.lastTimeLap[membersGroup._id] = millisecond;
                }
                const newLap = await lapInsert({
                    millisecond,
                    timeLap,
                    typeLap,
                    competitionId: competition._id,
                    roundId: round._id,
                    groupId: this.selectedGroup._id,
                    gateId: gate._id,
                    gateNumber,
                    memberGroupId: membersGroup._id,
                    sportsmanId: sportsman._id,
                    transponder
                });
                await groupSavePositions(this.selectedGroup._id).then((resGroup) => {
                    sendToAllMessage('group-update-response', resGroup);
                });

                if (round.typeRace === 'FIXED_COUNT_LAPS' && typeLap === 'OK') {
                    if (okLaps.length + 1 >= Number(round.countLap)) {
                        const text = `${getNameMemberInGroup(membersGroup)} финишировал!`;
                        speech(text);
                        const group = await groupFindById(this.selectedGroup._id);
                        if (
                            [...(group.sportsmen || []), ...(group.teams || [])].reduce(
                                (res, item) => item.finished && res,
                                true
                            )
                        ) {
                            setTimeout(() => {
                                speech('Все пилоты финишировали!');
                            }, 3000);
                            this.stop();
                        }
                    }
                }

                sendToAllMessage('new-lap-update', newLap);
            } else if (['PIT_STOP_BEGIN', 'PIT_STOP_END'].includes(gate?.type)) {
                if (
                    ('PIT_STOP_BEGIN' === gate?.type &&
                        ((gateDelay > 0 && gateDelay < millisecond - this.lastTimePitStopBegin[membersGroup._id]) ||
                            gateDelay === 0 ||
                            this.lastTimePitStopBegin[membersGroup._id] === undefined)) ||
                    ('PIT_STOP_END' === gate?.type &&
                        ((gateDelay > 0 && gateDelay < millisecond - this.lastTimePitStopEnd[membersGroup._id]) ||
                            gateDelay === 0 ||
                            this.lastTimePitStopEnd[membersGroup._id] === undefined))
                ) {
                    let timeLap = undefined;
                    if ('PIT_STOP_BEGIN' === gate?.type) {
                        this.lastTimePitStopBegin[membersGroup._id] = millisecond;
                        this.lastTimePitStopEnd[membersGroup._id] = undefined;
                    } else if ('PIT_STOP_END' === gate?.type && this.lastTimePitStopBegin[membersGroup._id]) {
                        timeLap = millisecond - this.lastTimePitStopBegin[membersGroup._id];
                        this.lastTimePitStopEnd[membersGroup._id] = millisecond;
                        this.lastTimePitStopBegin[membersGroup._id] = undefined;
                    }
                    const newLap = await lapInsert({
                        millisecond,
                        timeLap,
                        typeLap: gate?.type,
                        competitionId: competition._id,
                        roundId: round._id,
                        groupId: this.selectedGroup._id,
                        gateId: gate._id,
                        gateNumber,
                        memberGroupId: membersGroup._id,
                        sportsmanId: sportsman._id,
                        transponder
                    });
                    sendToAllMessage('new-lap-update', newLap);
                }
            } else if (gate?.type === 'GATE') {
                const inxCurrGate = _.findIndex(gates, ['_id', gate._id]);
                let typeLap = 'HIDDEN';
                let timeLap = undefined;
                if (
                    (inxCurrGate === 0 && !this.lastTimeGates?.[membersGroup._id]?.[gate._id]) || //first gate
                    (inxCurrGate > 0 &&
                        !!this.lastTimeGates?.[membersGroup._id]?.[gates[inxCurrGate - 1]._id] &&
                        !this.lastTimeGates?.[membersGroup._id]?.[gate._id])
                ) {
                    this.lastTimeGates[membersGroup._id] = {
                        ...(this.lastTimeGates[membersGroup._id] || {}),
                        [gate._id]: millisecond
                    };
                    timeLap =
                        inxCurrGate === 0
                            ? millisecond - this.lastTimeLap[membersGroup._id]
                            : millisecond - this.lastTimeGates[membersGroup._id][gates[inxCurrGate - 1]._id];

                    typeLap = 'GATE';
                }

                if (competition.playFail && typeLap === 'HIDDEN') {
                    //runServicePlay('fail.mp3');
                    speech(`${sportsman.nick} мимо!`);
                }
                const newLap = await lapInsert({
                    millisecond,
                    timeLap,
                    typeLap,
                    competitionId: competition._id,
                    roundId: round._id,
                    groupId: this.selectedGroup._id,
                    gateId: gate._id,
                    gateNumber,
                    memberGroupId: membersGroup._id,
                    sportsmanId: sportsman._id,
                    transponder
                });
                sendToAllMessage('new-lap-update', newLap);
            }
            this.numberPackages.push(numberPackage);
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

const runServicePlay = (file) => {
    return new Promise((resolve, reject) => {
        const fullPathToFile = path.join(app.getPath('userData'), `/sounds/${file}`);
        const worker = new Worker(path.join(__dirname, '../utils/play.js'), { workerData: { file: fullPathToFile } });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`stopped with  ${code} exit code`));
        });
    });
};

module.exports = { race: new Race() };
