import { randomId } from '@mui/x-data-grid-generator';
import { DEFAULT_COMPETITION_LOGO, DEFAULT_PHOTO } from '@/constants/images';

const remote = window.require('@electron/remote');
const { app } = remote;
const fs = remote.require('fs');
const fsPromise = window.require('fs').promises;

export const IMAGES_FOLDER = 'images';
export const getFilePath = (file: string): string => {
    try {
        return `data:image/png;base64,${fs
            .readFileSync(`${app.getPath('userData')}/${IMAGES_FOLDER}/${file}`)
            .toString('base64')}`;
    } catch (e) {
        return '';
    }
};

export const copyFile = async (file: string): Promise<string> => {
    const newPhotoName = `${randomId()}.${file.split('.').pop()}`;
    const pathPhoto = `${app.getPath('userData')}/${IMAGES_FOLDER}`;
    return fsPromise.copyFile(file, `${pathPhoto}/${newPhotoName}`).then(() => newPhotoName);
};

export const deleteFile = async (file: string): Promise<void> => {
    const pathPhoto = `${app.getPath('userData')}/${IMAGES_FOLDER}`;
    if (![DEFAULT_COMPETITION_LOGO, DEFAULT_PHOTO].includes(file)) {
        return fsPromise.unlink(`${pathPhoto}/${file}`);
    }
};
