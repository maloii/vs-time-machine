import { Buffer } from 'buffer';
import { captureSaveAction } from '@/actions/actionCaptureRequest';

let recorder: MediaRecorder | undefined;
let blobs: Blob[] = [];

function toArrayBuffer(blob: Blob, cb: any) {
    let fileReader = new FileReader();
    fileReader.onload = function () {
        let arrayBuffer = this.result;
        cb(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
}

export const captureStart = () => {
    if (window.mediaStream) {
        recorder = new MediaRecorder(window.mediaStream);

        recorder.addEventListener('dataavailable', (event) => {
            blobs.push(event.data);
            toArrayBuffer(new Blob(blobs, { type: 'video/webm' }), function (ab: any) {
                const buffer = Buffer.from(ab);
                captureSaveAction(buffer);
            });
            // startRaceAction(blobs);
        });
        recorder.start();
    }
};

export const captureStop = () => {
    if (recorder) {
        recorder.stop();
    }
};
