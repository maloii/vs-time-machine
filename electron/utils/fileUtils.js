const { ipcRenderer } = require('electron');
const fs = require('fs');
const fsPromise = require('fs').promises;
const { v4 } = require('uuid');

const IMAGES_FOLDER = 'images';
const DEFAULT_PHOTO = 'empty_person.png';
const DEFAULT_COMPETITION_LOGO = 'default_competition_logo.png';

ipcRenderer.invoke('get-path-user-data-handle').then((userData) => {
    global.userData = userData;
});

const getFilePath = (file) => {
    try {
        return `data:image/png;base64,${fs
            .readFileSync(`${global.userData}/${IMAGES_FOLDER}/${file}`)
            .toString('base64')}`;
    } catch (e) {
        return '';
    }
};

const copyFile = (file) => {
    const newPhotoName = `${v4()}.${file.split('.').pop()}`;
    const pathPhoto = `${global.userData}/${IMAGES_FOLDER}`;
    return fsPromise.copyFile(file, `${pathPhoto}/${newPhotoName}`).then(() => newPhotoName);
};

const saveFile = async (fileName, blob) => {
    const pathPhoto = `${global.userData}/${IMAGES_FOLDER}`;
    const newPhotoName = `${v4()}.${fileName.split('.').pop()}`;
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFile(`${pathPhoto}/${newPhotoName}`, buffer, (error, data) => {
        if (error) {
            console.error('error: ' + error);
        }
    });
    return newPhotoName;
};

const deleteFile = (file) => {
    const pathPhoto = `${global.userData}/${IMAGES_FOLDER}`;
    if (![DEFAULT_COMPETITION_LOGO, DEFAULT_PHOTO].includes(file)) {
        return fsPromise.unlink(`${pathPhoto}/${file}`);
    }
};

module.exports = {
    IMAGES_FOLDER,
    DEFAULT_PHOTO,
    DEFAULT_COMPETITION_LOGO,
    getFilePath,
    copyFile,
    deleteFile,
    saveFile
};
