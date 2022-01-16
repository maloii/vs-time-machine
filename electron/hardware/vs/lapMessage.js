const { sendToAllMessage } = require('../../ipcMessages/sendMessage');
const NUMBER_PACKAGE = 0;
const BASE_STATION_ID = 1;
const TRANSPONDER_ID = 2;
const LAP_TIME = 3;
const START_NUMBER = 4;

const lapMessage = (message, connector, race) => {
    const numberPackage = message[NUMBER_PACKAGE];
    const gateNumber = message[BASE_STATION_ID];
    const transponder = message[TRANSPONDER_ID];
    const lapTime = message[LAP_TIME];
    const startNumber = message[START_NUMBER];

    sendToAllMessage('lap-data-receive', Number(lapTime), transponder, numberPackage, gateNumber, startNumber);
    if (race) {
        race.newLap(Number(lapTime), transponder, numberPackage, gateNumber);
    }

    connector.send(`lapreceived:${numberPackage},${gateNumber}`);
};

module.exports = { lapMessage };
