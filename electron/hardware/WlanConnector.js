const dgram = require('dgram');
class WlanConnector {
    address = '192.168.197.255';
    portSend = 8889;
    portListen = 8888;
    socket;

    connect = (receive, address, portSend, portListen) => {
        try {
            this.address = address;
            this.portSend = portSend;
            this.portListen = portListen;
            this.socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
            this.socket.on('message', (data) => {
                receive(data.toString());
            });
            this.socket.bind(this.portListen);
        } catch (e) {
            return false;
        }
        return true;
    };

    disconnect = () => {
        this.socket.close();
        this.socket = undefined;
        return true;
    };

    send = (message) => {
        this.socket.setBroadcast(true);
        this.socket.send(Buffer.from(message, 'utf8'), 0, message.length, this.portSend, this.address);
    };

    isOpen = () => {
        return !!this.socket;
    };
}

module.exports = { WlanConnector };
