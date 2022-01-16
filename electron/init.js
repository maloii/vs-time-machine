const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const fsPromise = require('fs').promises;

const IMAGES_FOLDER = 'images';
const SOUNDS_FOLDER = 'sounds';
const SOUND_BEEP = 'beep.wav';
const SOUND_LONG_BEEP = 'long_beep.wav';
const SOUND_SHORT_BEEP = 'short_beep.mp3';

const copyDefaultImages = () => {
    const pathImages = `${app.getPath('userData')}/${IMAGES_FOLDER}`;
    const pathSounds = `${app.getPath('userData')}/${SOUNDS_FOLDER}`;
    if (!fs.existsSync(pathImages)) {
        fs.mkdirSync(pathImages);
    }
    if (!fs.existsSync(pathSounds)) {
        fs.mkdirSync(pathSounds);
    }
    if (!fs.existsSync(`${pathImages}/empty_person.png`)) {
        fsPromise
            .copyFile(path.join(__dirname, `../assets/empty_person.png`), `${pathImages}/empty_person.png`)
            .then(() => {});
    }
    if (!fs.existsSync(`${pathImages}/default_competition_logo.png`)) {
        fsPromise
            .copyFile(
                path.join(__dirname, `../assets/default_competition_logo.png`),
                `${pathImages}/default_competition_logo.png`
            )
            .then(() => {});
    }
    if (!fs.existsSync(`${pathSounds}/${SOUND_BEEP}`)) {
        fsPromise
            .copyFile(path.join(__dirname, `../assets/${SOUND_BEEP}`), `${pathSounds}/${SOUND_BEEP}`)
            .then(() => {});
    }
    if (!fs.existsSync(`${pathSounds}/${SOUND_SHORT_BEEP}`)) {
        fsPromise
            .copyFile(path.join(__dirname, `../assets/${SOUND_SHORT_BEEP}`), `${pathSounds}/${SOUND_SHORT_BEEP}`)
            .then(() => {});
    }
    if (!fs.existsSync(`${pathSounds}/${SOUND_LONG_BEEP}`)) {
        fsPromise
            .copyFile(path.join(__dirname, `../assets/${SOUND_LONG_BEEP}`), `${pathSounds}/${SOUND_LONG_BEEP}`)
            .then(() => {});
    }
};

const init = () => {
    copyDefaultImages();
};

module.exports = { init };
