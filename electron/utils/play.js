const { workerData, parentPort } = require('worker_threads');
const sound = require('node-wav-player');

console.log(workerData.file);
sound.play({ path: workerData.file }).then(() => parentPort.postMessage({ ok: 'ok' }));
