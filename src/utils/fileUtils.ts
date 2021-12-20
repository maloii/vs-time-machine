import { randomId } from '@mui/x-data-grid-generator';

const remote = window.require('electron').remote;
const { app } = remote;
const fs = remote.require('fs');
const path = remote.require('path');
const fsPromise = window.require('fs').promises;

const PHOTO_FOLDER = 'photo';
export const getFilePath = (file: string): string => {
    console.log(`${app.getPath('userData')}/${PHOTO_FOLDER}/${file}`);
    try {
        return `data:image/png;base64,${fs
            .readFileSync(`${app.getPath('userData')}/${PHOTO_FOLDER}/${file}`)
            .toString('base64')}`;
    } catch (e) {
        return '';
    }
};
export const copyFileEmptyPerson = async (): Promise<void> => {
    const pathPhoto = `${app.getPath('userData')}/${PHOTO_FOLDER}`;
    if (!fs.existsSync(pathPhoto)) {
        fs.mkdirSync(pathPhoto);
    }
    if (!fs.existsSync(`${pathPhoto}/empty_person.png`)) {
        return fsPromise.copyFile(
            !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
                ? './photo/empty_person.png'
                : path.join(__dirname, '../build/photo/empty_person.png'),
            `${pathPhoto}/empty_person.png`
        );
    }
};
export const copyFile = async (file: string): Promise<string> => {
    await copyFileEmptyPerson();
    const newPhotoName = `${randomId()}.${file.split('.').pop()}`;
    const pathPhoto = `${app.getPath('userData')}/${PHOTO_FOLDER}`;
    return fsPromise.copyFile(file, `${pathPhoto}/${newPhotoName}`).then(() => newPhotoName);
};
