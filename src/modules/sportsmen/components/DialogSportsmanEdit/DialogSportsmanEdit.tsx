import React, { ChangeEvent, FC, SyntheticEvent, useCallback, useRef, useState } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    Box,
    DialogActions,
    DialogTitle,
    TextField,
    Divider,
    Autocomplete,
    Chip,
    AutocompleteValue
} from '@mui/material';
import { sportsmanUpdateAction } from '@/actions/actionRequest';
import { story } from '@/story/story';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { ISportsman } from '@/types/ISportsman';

import styles from './styles.module.scss';
import { observer } from 'mobx-react';

interface IProps {
    open: boolean;
    onClose: () => void;
    sportsman?: ISportsman;
    onSave: (sportsman: Omit<ISportsman, '_id' | 'competitionId'>) => void;
    onUpdate: (_id: string, sportsman: Omit<ISportsman, '_id' | 'competitionId'>) => void;
    onDelete: (_id: string) => void;
}

export const DialogSportsmanEdit: FC<IProps> = observer(
    ({ open, onClose, sportsman, onSave, onUpdate, onDelete }: IProps) => {
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
        const [photo, setPhoto] = useState(sportsman?.photo || window.api.DEFAULT_PHOTO);
        const [transponders, setTransponders] = useState(sportsman?.transponders || []);

        const inputFileRef = useRef<HTMLInputElement>(null);
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
        const handleChangePhoto = useCallback(async (_event: ChangeEvent<HTMLInputElement>) => {
            if (inputFileRef.current && inputFileRef.current.files?.[0]?.path) {
                setPhoto(await window.api.copyFile(inputFileRef.current.files?.[0]?.path));
            }
        }, []);
        const handleChangeDeletePhoto = useCallback(async () => {
            await window.api.deleteFile(photo).then(async () => {
                setPhoto(window.api.DEFAULT_PHOTO);
                if (sportsman && story.competition) {
                    sportsmanUpdateAction(sportsman._id, { photo: window.api.DEFAULT_PHOTO });
                }
            });
        }, [photo, sportsman]);

        const handleChangeTransponders = useCallback(
            (event: SyntheticEvent, value: AutocompleteValue<any, any, any, any>) => {
                setTransponders(value);
            },
            []
        );

        const handleSave = useCallback(async () => {
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
                transponders: [...transponders],
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
            sportsman?.selected,
            team,
            transponders
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
                        <Autocomplete
                            multiple
                            fullWidth
                            options={[]}
                            value={(transponders || []).map(String)}
                            disableClearable
                            freeSolo
                            autoSelect
                            style={{ width: 'calc(50ch + 16px)' }}
                            renderTags={(value: readonly string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                ))
                            }
                            onChange={handleChangeTransponders}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    type="number"
                                    variant="filled"
                                    label="Transponders"
                                    placeholder="Transponders"
                                />
                            )}
                        />
                        <TextField
                            label="Last name"
                            error={!lastName}
                            value={lastName}
                            onChange={handleChangeLastName}
                        />
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
                        <div>
                            {!!photo && photo !== window.api.DEFAULT_PHOTO && (
                                <CancelOutlinedIcon className={styles.deletePhoto} onClick={handleChangeDeletePhoto} />
                            )}
                            <img
                                ref={imageRef}
                                src={window.api.getFilePath(photo || window.api.DEFAULT_PHOTO)}
                                alt="sportsman"
                            />
                            <Button variant="contained" component="label">
                                Select photo
                                <input
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    ref={inputFileRef}
                                    hidden
                                    onChange={handleChangePhoto}
                                />
                            </Button>
                        </div>
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
    }
);
