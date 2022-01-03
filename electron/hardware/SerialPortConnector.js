const SerialPort = require('serialport');

class SerialPortConnector {
    port;

    constructor() {}

    connect = (receive, path) => {
        try {
            this.port = new SerialPort(path, { baudRate: 115200 });
            this.port?.on('data', (data) => {
                receive(data.toString());
            });
        } catch (e) {
            return false;
        }
        return true;
    };

    disconnect = () => {
        if (this.port && this.port.isOpen) {
            this.port.close();
            return true;
        }
        return false;
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
