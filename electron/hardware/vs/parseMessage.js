const { crc8 } = require('../../utils/crc8');
const { timeSynchOkMessage } = require('./timeSynchOkMessage');

const parseMessage = (message, connector) => {
    if (!message || message.length < 3 || message.indexOf(':') < 0 || message.indexOf(',') < 0) return;
    const arrMessage = message.split(':');
    if (arrMessage.length > 1) {
        const arrDataMessage = arrMessage[1].split(',');
        if (crc8(message.slice(0, message.lastIndexOf(','))) === Number(arrDataMessage[arrDataMessage.length - 1])) {
            if (arrMessage[0] === 'lap') {
                // new LapMessage(arrDataMessage, lapRepository, raceService, connectorService).parse();
            } else if (arrMessage[0] === 'ping') {
                // new PingMessage(arrDataMessage).parse();
            } else if (arrMessage[0] === 'timesynchok') {
                timeSynchOkMessage(arrDataMessage, connector);
            } else if (arrMessage[0] === 'echotrans') {
                // new EchoTransMessage(arrDataMessage, raceService, connectorService).parse();
            }

            //"systime:%lld,%d,%d,%s,%d,%d,%d,%d",getRealTime(), sensitivity, gate, VERSION, frequencyIndex, capacitorCalbr, frequencyOffset1, frequencyOffset2)
            //"info:%lld,%d,%d,%s,%d,,,,,,",time, sensitivity, gate, VERSION,frequencyIndex)
            //"gate:%d,%d,%d,%lld", gate, colorGate, idTransponder, lapTime);
            //"bootflashok:%d\r\n", idTransponder)
            //"bootflasherror:%d\r\n", idTransponder)
            //"infocalibrtrans:%d,%d,%d", idTransponder, rssi, calbr)
        }
    }
};

module.exports = { parseMessage };
