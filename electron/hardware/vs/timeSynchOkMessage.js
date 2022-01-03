const BASE_STATION_ID = 0;

const timeSynchOkMessage = (message, connector) => {
    const baseStationNumber = message[BASE_STATION_ID];
    connector.syncTimeSuccess();
    connector.send(`timesynchreceived:${baseStationNumber}`);
};

module.exports = { timeSynchOkMessage };
