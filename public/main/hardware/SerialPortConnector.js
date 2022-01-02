// import { parseMessage } from './vs/parseMessage';

const SerialPort = require('serialport');

class SerialPortConnector {
    port;

    connection = (path) => {
        this.port = new SerialPort(path, { baudRate: 115200 });
        // this.port?.on('data', (data) => {
        //     parseMessage(data.toString());
        // });
    };

    disconnect = () => {
        if (this.port) {
            this.port.close();
        }
    };

    send = (message) => {
        if (this.port) {
            this.port.write(message);
        }
    };

    isOpen = () => {
        if (this.port) {
            return this.port.isOpen;
        } else {
            return false;
        }
    };
}

module.exports = { SerialPortConnector };
