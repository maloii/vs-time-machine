const { sendToAllMessage } = require('../../ipcMessages/sendMessage');
const GATE_NUMBER = 0;
// const GATE_COLOR = 1;
const TRANSPONDER_ID = 2;
const LAP_TIME = 3;

const gateMessage = (message, connector, race) => {
    const gateNumber = message[GATE_NUMBER];
    // const gateColor = message[GATE_COLOR];
    const transponder = message[TRANSPONDER_ID];
    const lapTime = message[LAP_TIME];

    sendToAllMessage('lap-data-receive', Number(lapTime), transponder, undefined, gateNumber, undefined);
    if (race) {
        race.newGate(Number(lapTime), transponder, gateNumber);
    }
};

module.exports = { gateMessage };
