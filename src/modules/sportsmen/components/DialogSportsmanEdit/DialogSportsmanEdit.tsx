import React, { ChangeEvent, FC, useCallback, useRef, useState } from 'react';
import { Button, Dialog, DialogContent, Box, DialogActions, DialogTitle, TextField, Divider } from '@mui/material';
import { ISportsman } from '@/types/ISportsman';
import { getFilePath, copyFile } from '@/utils/fileUtils';

import styles from './styles.module.scss';

interface IProps {
    open: boolean;
    onClose: () => void;
    sportsman?: ISportsman;
    onSave: (sportsman: Omit<ISportsman, '_id' | 'competitionId' | 'dateCreate'>) => void;
    onUpdate: (_id: string, sportsman: Omit<ISportsman, '_id' | 'competitionId' | 'dateCreate'>) => void;
    onDelete: (_id: string) => void;
}

export const DialogSportsmanEdit: FC<IProps> = ({ open, onClose, sportsman, onSave, onUpdate, onDelete }: IProps) => {
    const [firstName, setFirstName] = useState(sportsman?.firstName || '');
    const [lastName, setLastName] = useState(sportsman?.lastName || '');
    const [middleName, setMiddleName] = useState(sportsman?.middleName || '');
    const [nick, setNick] = useState(sportsman?.nick || '');

    const [city, setCity] = useState(sportsman?.city || '');
    const [age, setAge] = useState(sportsman?.age || '');
    const [team, setTeam] = useState(sportsman?.team || '');
    const [phone, setPhone] = useState(sportsman?.phone || '');
    const [email, setEmail] = useState(sportsman?.email || '');
    const [country, setCountry] = useState(sportsman?.country || '');
    const [position, setPosition] = useState(sportsman?.position || '');
    const [photo, setPhoto] = useState(sportsman?.photo || '');

    const fileRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleChangeFirstName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    }, []);
    const handleChangeLastName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
    }, []);
    const handleChangeMiddleName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setMiddleName(event.target.value);
    }, []);
    const handleChangeNick = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setNick(event.target.value);
    }, []);
    const handleChangeCity = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    }, []);
    const handleChangeAge = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setAge(event.target.value);
    }, []);
    const handleChangeTeam = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setTeam(event.target.value);
    }, []);
    const handleChangePhone = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
    }, []);
    const handleChangeEmail = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }, []);
    const handleChangeCountry = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCountry(event.target.value);
    }, []);
    const handleChangePosition = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPosition(event.target.value);
    }, []);
    const handleChangePhoto = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        if (fileRef.current && fileRef.current.files?.[0]?.path) {
            setPhoto(await copyFile(fileRef.current.files?.[0]?.path));
        }
    }, []);

    const handleSave = useCallback(async () => {
        if (fileRef.current && fileRef.current.files?.[0]?.path) {
            const newPhotoName = await copyFile(fileRef.current.files?.[0]?.path);
            console.log(newPhotoName);
        }
        const newDataSportsman = {
            firstName,
            lastName,
            middleName,
            nick,
            photo,
            city,
            age: Number(age) || undefined,
            team,
            phone,
            email,
            country,
            position: Number(position) || undefined
        };
        if (sportsman?._id) {
            onUpdate(sportsman?._id, { ...newDataSportsman, selected: sportsman.selected });
        } else {
            onSave({ ...newDataSportsman, selected: true });
        }
    }, [
        age,
        city,
        country,
        email,
        firstName,
        lastName,
        middleName,
        nick,
        onSave,
        onUpdate,
        phone,
        photo,
        position,
        sportsman?._id,
        team
    ]);

    const handleDelete = useCallback(() => {
        if (sportsman?._id) {
            onDelete(sportsman?._id);
        }
    }, [onDelete, sportsman?._id]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{sportsman ? 'Edit' : 'New'} sportsman</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' }
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField label="Last name" error={!lastName} value={lastName} onChange={handleChangeLastName} />
                    <TextField label="First name" value={firstName} onChange={handleChangeFirstName} />
                    <TextField label="Middle name" value={middleName} onChange={handleChangeMiddleName} />
                    <TextField label="Nick(OSD)" value={nick} onChange={handleChangeNick} />
                </Box>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' }
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Divider style={{ width: 'calc(50ch + 16px)' }} />
                    <TextField label="City" value={city} onChange={handleChangeCity} />
                    <TextField label="Age" type="number" value={age} onChange={handleChangeAge} />
                    <TextField label="Team" value={team} onChange={handleChangeTeam} />
                    <TextField label="Phone" value={phone} onChange={handleChangePhone} />
                    <TextField label="Email" value={email} onChange={handleChangeEmail} />
                    <TextField label="Country" value={country} onChange={handleChangeCountry} />
                    <TextField label="Position" type="number" value={position} onChange={handleChangePosition} />
                </Box>
                <div className={styles.photoBlock}>
                    <img ref={imageRef} src={getFilePath(photo || 'empty_person.png')} alt="sportsman" />
                    <Button variant="contained" component="label">
                        Select photo
                        <input type="file" ref={fileRef} hidden onChange={handleChangePhoto} />
                    </Button>
                </div>
            </DialogContent>
            <DialogActions>
                {!!sportsman && (
                    <Button onClick={handleDelete} style={{ marginRight: 'auto' }} color="error">
                        Delete
                    </Button>
                )}
                <Button onClick={onClose}>Close</Button>
                <Button onClick={handleSave} disabled={!lastName}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
