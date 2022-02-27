const Say = require('say').Say;
const say = new Say();

const speech = (text) => {
    say.speak(text);
};

module.exports = { speech };
