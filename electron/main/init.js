const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const fsPromise = require('fs').promises;

const IMAGES_FOLDER = 'images';

const copyDefaultImages = () => {
    const pathImages = `${app.getPath('userData')}/${IMAGES_FOLDER}`;
    if (!fs.existsSync(pathImages)) {
        fs.mkdirSync(pathImages);
    }
    if (!fs.existsSync(`${pathImages}/empty_person.png`)) {
        fsPromise
            .copyFile(path.join(__dirname, `../../assets/empty_person.png`), `${pathImages}/empty_person.png`)
            .then(() => {});
    }
    if (!fs.existsSync(`${pathImages}/default_competition_logo.png`)) {
        fsPromise
            .copyFile(
                path.join(__dirname, `../../assets/default_competition_logo.png`),
                `${pathImages}/default_competition_logo.png`
            )
            .then(() => {});
    }
};

const init = () => {
    copyDefaultImages();
};

module.exports = { init };
