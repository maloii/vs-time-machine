import { makeAutoObservable } from 'mobx';
import { PortInfo } from 'serialport';
import { parseMessage } from './MessageService';

const SerialPort = window.require('serialport');

class SerialPortService {
  public port: typeof SerialPort | undefined;
  public logs: Array<string> = [];
  public lastLog: string = '';
  public isOpen: boolean = false;
  public listPorts: PortInfo[] = [];

  public constructor() {
    makeAutoObservable(this);
    setTimeout(() => {
      const updateSerialPortData = () => {
        SerialPort.list()
          .then((data: PortInfo[]) => this.setListPorts(data))
          .finally(() => setTimeout(updateSerialPortData, 1000));
        this.setIsOpen(this.getPort()?.isOpen);
      };
      updateSerialPortData();
    }, 1000);
  }

  public open = (path: string) => {
    this.port = new SerialPort(path, { baudRate: 115200 });
    this.port.on('data', (data: Buffer) => {
      this.lastLog = data.toString();
      parseMessage(this.lastLog);
      this.logs.push(this.lastLog);
    });
  };

  public close = () => {
    if (this.port && this.port.isOpen) {
      this.port.close();
    }
  };

  public list = (): Promise<PortInfo[]> => {
    return SerialPort.list();
  };

  public setListPorts(ports: PortInfo[]): void {
    this.listPorts = ports;
  }

  public setIsOpen(status: boolean): void {
    this.isOpen = status;
  }

  public getPort(): typeof SerialPort | undefined {
    return this.port;
  }
}

export default new SerialPortService();
