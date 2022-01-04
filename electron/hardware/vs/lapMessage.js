const NUMBER_PACKAGE = 0;
const BASE_STATION_ID = 1;
const TRANSPONDER_ID = 2;
const LAP_TIME = 3;
// const START_NUMBER = 4;

const lapMessage = (message, connector, race) => {
    const numberPackage = message[NUMBER_PACKAGE];
    const gateNumber = message[BASE_STATION_ID];
    const transponder = message[TRANSPONDER_ID];
    const lapTime = message[LAP_TIME];
    // const startNumber = message[START_NUMBER];

    if (race) {
        race.newLap(lapTime, transponder, numberPackage);
    }

    connector.send(`lapreceived:${numberPackage},${gateNumber}`);
};

module.exports = { lapMessage };
