const { SerialPortConnector } = require('./hardware/SerialPortConnector');
const { WlanConnector } = require('./hardware/WlanConnector');
const { parseMessage } = require('./hardware/vs/parseMessage');
const { DateTime } = require('luxon');

class Connector {
    connector = undefined;
    isConnect = false;
    isSyncTime = false;

    connect = (type, ...params) => {
        if (!this.connector) {
            if (type === 'WLAN') {
                this.connector = new WlanConnector(this);
            } else if (type === 'SERIAL_PORT') {
                this.connector = new SerialPortConnector();
            }
        }
        if (this.connector.connect(this.receive, ...params)) {
            this.isConnect = true;
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
        parseMessage(message, this);
        if (global.mainWindow) {
            global.mainWindow.webContents.send('connector-message', message.toString());
        }
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
}

module.exports = { connector: new Connector() };
