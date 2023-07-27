const { workerData, parentPort } = require('worker_threads');
const sound = require('node-wav-player');

sound.play({ path: workerData.file }).then(() => parentPort.postMessage({ ok: 'ok' }));
