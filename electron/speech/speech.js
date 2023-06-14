const Say = require('./say').Say;
const say = new Say();

const speech = (text, voice) => {
    say.speak(text, voice || undefined);
};

const getWindowsVoicesPromise = () => {
    return new Promise((resolve, reject) => {
        say.getInstalledVoices((err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
};

const getWindowsVoices = () => {
    return getWindowsVoicesPromise();
};

module.exports = { speech, getWindowsVoices };
