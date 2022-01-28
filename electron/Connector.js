const { SerialPortConnector } = require('./hardware/SerialPortConnector');
const { WlanConnector } = require('./hardware/WlanConnector');
const { parseMessage } = require('./hardware/vs/parseMessage');
const { DateTime } = require('luxon');

class Connector {
    connector = undefined;
    isConnect = false;
    isSyncTime = false;
    race;

    connect = (type, ...params) => {
        if (!this.connector) {
            if (type === 'WLAN') {
                this.connector = new WlanConnector();
            } else if (type === 'SERIAL_PORT') {
                this.connector = new SerialPortConnector();
            }
        }
        if (this.connector.connect(this.receive, ...params)) {
            this.isConnect = true;
            this.sendSyncTime();
        }
    };

    disconnect = () => {
        if (this.connector.disconnect()) {
            this.connector = undefined;
            this.isConnect = false;
            this.type = undefined;
            return true;
        }
        return false;
    };

    receive = (message) => {
        console.log(message);
        parseMessage(message, this, this.race);
        Object.values(global.windows).forEach((item) => {
            item.webContents.send('connector-message', message.toString());
        });
    };

    send = (message) => {
        console.log(message);
        if (this.isConnect) {
            this.connector.send(message + '\n');
        }
    };

    sendSyncTime = () => {
        this.isSyncTime = false;
        this.send(`settime:${DateTime.now().toMillis()}`);
    };

    syncTimeSuccess = () => {
        this.isSyncTime = true;
    };

    setRace = (newRace) => {
        this.race = newRace;
    };
}

module.exports = { connector: new Connector() };
