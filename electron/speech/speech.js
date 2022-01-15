const Say = require('say').Say;
const say = new Say('darwin' || 'win32' || 'linux');

const speech = (text) => {
    say.speak(text);
};

module.exports = { speech };
