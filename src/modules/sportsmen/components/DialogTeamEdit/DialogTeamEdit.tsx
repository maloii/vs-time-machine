import React, { ChangeEvent, FC, useCallback, useRef, useState } from 'react';
import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { story } from '@/story/story';
import { teamUpdateAction } from '@/actions/actionRequest';

import styles from './styles.module.scss';

interface IProps {
    open: boolean;
    onClose: () => void;
    team?: ITeam;
    teams: ITeam[];
    sportsmen: ISportsman[];
    onSave: (team: Omit<ITeam, '_id' | 'competitionId'>) => void;
    onUpdate: (_id: string, team: Omit<ITeam, '_id' | 'competitionId'>) => void;
    onDelete: (_id: string) => void;
}

export const DialogTeamEdit: FC<IProps> = ({
    open,
    onClose,
    team,
    teams,
    sportsmen,
    onSave,
    onUpdate,
    onDelete
}: IProps) => {
    const [name, setName] = useState(team?.name || '');
    const [photo, setPhoto] = useState(team?.photo || '');
    const [city, setCity] = useState(team?.city || '');
    const [country, setCountry] = useState(team?.country || '');
    const [position, setPosition] = useState(team?.position || '');
    const [sportsmenIds, setSportsmenIds] = useState<Array<string>>(team?.sportsmenIds || []);

    const inputFileRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const sportsmenForTeams = sportsmen.filter(
        (sportsman) =>
            !teams
                .filter((item) => item._id !== team?._id)
                .flatMap((item) => item.sportsmenIds)
                .includes(sportsman._id)
    );

    const handleChangeName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);
    const handleChangeCity = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    }, []);
    const handleChangeCountry = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCountry(event.target.value);
    }, []);
    const handleChangePosition = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPosition(event.target.value);
    }, []);
    const handleChangeSportsmenIds = useCallback((event: SelectChangeEvent<Array<string>>) => {
        setSportsmenIds(event.target.value as string[]);
    }, []);
    const handleChangePhoto = useCallback(async (_event: ChangeEvent<HTMLInputElement>) => {
        if (inputFileRef.current && inputFileRef.current.files?.[0]?.path) {
            setPhoto(await window.api.copyFile(inputFileRef.current.files?.[0]?.path));
        }
    }, []);
    const handleChangeDeletePhoto = useCallback(async () => {
        await window.api.deleteFile(photo).then(async () => {
            setPhoto(window.api.DEFAULT_PHOTO);
            if (team && story.competition) {
                teamUpdateAction(team._id, { photo: window.api.DEFAULT_PHOTO });
            }
        });
    }, [photo, team]);

    const handleSave = useCallback(async () => {
        const newDataTeam = {
            name,
            photo,
            city,
            country,
            position: Number(position) || undefined,
            sportsmenIds: [...sportsmenIds]
        };
        if (team?._id) {
            onUpdate(team?._id, { ...newDataTeam, selected: team.selected });
        } else {
            onSave({ ...newDataTeam, selected: true });
        }
    }, [city, country, name, onSave, onUpdate, photo, position, sportsmenIds, team?._id, team?.selected]);

    const handleDelete = useCallback(() => {
        if (team?._id) {
            onDelete(team?._id);
        }
    }, [onDelete, team?._id]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{team ? 'Edit' : 'New'} team</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                    <TextField fullWidth label="Team name" value={name} error={!name} onChange={handleChangeName} />
                    <TextField fullWidth label="City" value={city} onChange={handleChangeCity} />
                    <TextField fullWidth label="Country" value={country} onChange={handleChangeCountry} />
                    <TextField
                        fullWidth
                        label="Position"
                        type="number"
                        value={position}
                        onChange={handleChangePosition}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="sportsmen-label">Sportsmen</InputLabel>
                        <Select<Array<string>>
                            labelId="sportsmen-label"
                            value={sportsmenIds}
                            label="Sportsmen"
                            multiple
                            onChange={handleChangeSportsmenIds}
                        >
                            {(sportsmenForTeams || []).map((sportsman) => (
                                <MenuItem
                                    key={sportsman._id}
                                    value={sportsman._id}
                                    selected={sportsmenIds.includes(sportsman._id)}
                                >
                                    {`${sportsman.lastName || ''}${
                                        sportsman.firstName ? ` ${sportsman.firstName}` : ''
                                    } ${sportsman.middleName ? ` ${sportsman.middleName}` : ''}${
                                        sportsman.nick ? ` (${sportsman.nick})` : ''
                                    }`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                </Box>
            </DialogContent>
            <DialogActions>
                {!!team && (
                    <Button onClick={handleDelete} style={{ marginRight: 'auto' }} color="error">
                        Delete
                    </Button>
                )}
                <Button onClick={onClose}>Close</Button>
                <Button onClick={handleSave} disabled={!name}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
