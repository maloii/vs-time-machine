import { crc8 } from '../utils/crc8';

export const parseMessage = (message: string): void => {
    if (!message || message.length < 3 || message.indexOf(':') < 0 || message.indexOf(',') < 0) return;
    const arrMessage = message.split(':');
    if (arrMessage.length > 1) {
        const arrDataMessage = arrMessage[1].split(',');
        if (crc8(message.slice(0, message.lastIndexOf(','))) === Number(arrDataMessage[arrDataMessage.length - 1])) {
            console.log('---OK-----');
        }
    }
};
