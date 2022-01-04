const TRANSPONDER_ID = 0;

const echoTransMessage = (message, connector, race) => {
    const transponder = message[TRANSPONDER_ID];

    if (race) {
        race.transponderHasBeenFound(transponder);
    }
    connector.send(`echook:${transponder}`);
};

module.exports = { echoTransMessage };
