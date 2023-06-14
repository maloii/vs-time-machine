const Say = require('./say').Say;
const say = new Say();

const speech = (text, voice) => {
    say.speak(text, voice || undefined);
};

const getWindowsVoices = () => {
    return say.getVoices();
};

module.exports = { speech, getWindowsVoices };
