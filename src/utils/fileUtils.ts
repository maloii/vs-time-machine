import { randomId } from '@mui/x-data-grid-generator';

const remote = window.require('electron').remote;
const { app } = remote;
const fs = remote.require('fs');
const fsPromise = window.require('fs').promises;

export const PHOTO_FOLDER = 'photo';
export const getFilePath = (file: string): string => {
    try {
        return `data:image/png;base64,${fs
            .readFileSync(`${app.getPath('userData')}/${PHOTO_FOLDER}/${file}`)
            .toString('base64')}`;
    } catch (e) {
        return '';
    }
};

export const copyFile = async (file: string): Promise<string> => {
    const newPhotoName = `${randomId()}.${file.split('.').pop()}`;
    const pathPhoto = `${app.getPath('userData')}/${PHOTO_FOLDER}`;
    return fsPromise.copyFile(file, `${pathPhoto}/${newPhotoName}`).then(() => newPhotoName);
};
