import React, { FC, useCallback, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import { TypeRound } from '@/types/TypeRound';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { TypeRace } from '@/types/TypeRace';
import { TypeGenerateRound } from '@/types/TypeGenerateRound';
import { IRound } from '@/types/IRound';
import { TypeParentEntity } from '@/types/TypeParentEntity';
import { TypeRaceElimination } from '@/types/TypeRaceElimination';
import { TypeStartRace } from '@/types/TypeStartRace';
import { millisecondsToTimeString } from '@/utils/millisecondsToTimeString';

interface IProps {
    open: boolean;
    onClose: () => void;
    onSave: (
        round: Omit<
            IRound,
            '_id' | 'competitionId' | 'selected' | 'dateCreate' | 'minTimeLap' | 'close' | 'sort' | 'groups'
        >
    ) => void;
    onUpdate: (
        round: Omit<
            IRound,
            '_id' | 'competitionId' | 'selected' | 'dateCreate' | 'minTimeLap' | 'close' | 'sort' | 'groups'
        >
    ) => void;
    onDelete: (_id: string) => void;
    rounds: IRound[];
    round?: IRound;
}

export const DialogFormRound: FC<IProps> = ({ open, onClose, onSave, onUpdate, onDelete, rounds, round }: IProps) => {
    const [name, setName] = useState(round?.name || '');
    const [typeRound, setTypeRound] = useState(round?.typeRound || TypeRound.PRACTICE);
    const [typeRace, setTypeRace] = useState(round?.typeRace || TypeRace.FIXED_COUNT_LAPS);
    const [typeStartRace, setTypeStartRace] = useState(round?.typeStartRace || TypeStartRace.START_AFTER_SIGNAL);
    const [countLap, setCountLap] = useState(round?.countLap || 5);
    const [maxTimeRace, setMaxTimeRace] = useState(round?.maxTimeRace || 180);
    //
    const [typeGenerateRound, setTypeGenerateRound] = useState(TypeGenerateRound.NONE);
    const [countSportsmen, setCountSportsmen] = useState(4);
    const [fromRoundCopy, setFromRoundCopy] = useState<string | undefined>(
        rounds.length > 0 ? rounds[rounds.length - 1]._id : undefined
    );
    const [typeRaceElimination, setTypeRaceElimination] = useState(TypeRaceElimination.NONE);
    const [typeParentEntity, setTypeParentEntity] = useState(TypeParentEntity.NONE);
    const [parentEntity, setParentEntity] = useState<string | undefined>(
        rounds.length > 0 ? rounds[rounds.length - 1]._id : undefined
    );
    const [countNextGo, setCountNextGo] = useState(2);

    const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);
    const handleChangeTypeRound = useCallback((event: SelectChangeEvent<TypeRound>) => {
        setTypeRound(event.target.value as TypeRound);
    }, []);
    const handleChangeTypeRace = useCallback((event: SelectChangeEvent<TypeRace>) => {
        setTypeRace(event.target.value as TypeRace);
    }, []);
    const handleChangeTypeStartRace = useCallback((event: SelectChangeEvent<TypeStartRace>) => {
        setTypeStartRace(event.target.value as TypeStartRace);
    }, []);
    const handleChangeCountLap = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setCountLap(Number(event.target.value));
    }, []);
    const handleChangeMaxTimeRace = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setMaxTimeRace(Number(event.target.value));
    }, []);
    const handleChangeTypeGenerateRound = useCallback((event: SelectChangeEvent<TypeGenerateRound>) => {
        setTypeGenerateRound(event.target.value as TypeGenerateRound);
    }, []);
    const handleChangeCountSportsmen = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setCountSportsmen(Number(event.target.value));
    }, []);
    const handleChangeFromRoundCopy = useCallback((event: SelectChangeEvent<string>) => {
        setFromRoundCopy(event.target.value as string);
    }, []);
    const handleChangeTypeRaceElimination = useCallback((event: SelectChangeEvent<TypeRaceElimination>) => {
        setTypeRaceElimination(event.target.value as TypeRaceElimination);
    }, []);
    const handleChangeTypeParentEntity = useCallback((event: SelectChangeEvent<TypeParentEntity>) => {
        setTypeParentEntity(event.target.value as TypeParentEntity);
    }, []);
    const handleChangeParentEntity = useCallback((event: SelectChangeEvent<string>) => {
        setParentEntity(event.target.value as string);
    }, []);
    const handleChangeCountNextGo = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setCountNextGo(Number(event.target.value));
    }, []);

    const handleSave = useCallback(
        () =>
            (round ? onUpdate : onSave)({
                name,
                typeRound,
                typeRace,
                typeStartRace,
                countLap,
                maxTimeRace,
                typeGenerateRound,
                countSportsmen,
                fromRoundCopy,
                typeRaceElimination,
                typeParentEntity,
                parentEntity,
                countNextGo
            }),
        [
            round,
            onUpdate,
            onSave,
            name,
            typeRound,
            typeRace,
            typeStartRace,
            countLap,
            maxTimeRace,
            typeGenerateRound,
            countSportsmen,
            fromRoundCopy,
            typeRaceElimination,
            typeParentEntity,
            parentEntity,
            countNextGo
        ]
    );

    const handleDelete = useCallback(() => {
        if (round) {
            onDelete(round._id);
        }
    }, [onDelete, round]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{round ? 'Edit' : 'New'} round</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' }
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField label="Name" error={!name} value={name} onChange={handleChangeName} />
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="type-round-label">Type round</InputLabel>
                        <Select<TypeRound>
                            labelId="type-round-label"
                            value={typeRound}
                            label="Type round"
                            onChange={handleChangeTypeRound}
                        >
                            {Object.keys(TypeRound).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {key}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="start-race-label">Type start race</InputLabel>
                        <Select<TypeStartRace>
                            labelId="start-race-label"
                            value={typeStartRace}
                            label="Type start race"
                            onChange={handleChangeTypeStartRace}
                        >
                            {Object.keys(TypeStartRace).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {key}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="type-race-label">Type race</InputLabel>
                        <Select<TypeRace>
                            labelId="type-race-label"
                            value={typeRace}
                            label="Type race"
                            onChange={handleChangeTypeRace}
                        >
                            {Object.keys(TypeRace).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {key}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {typeRace === TypeRace.FIXED_COUNT_LAPS && (
                        <TextField label="Count laps" value={countLap} type="number" onChange={handleChangeCountLap} />
                    )}
                    {typeRace !== TypeRace.NONE && (
                        <TextField
                            label={typeRace === TypeRace.FIXED_COUNT_LAPS ? 'Max time race (sec)' : 'Time race (sec)'}
                            value={maxTimeRace}
                            type="number"
                            helperText={millisecondsToTimeString(Number(maxTimeRace) * 1000, false)}
                            onChange={handleChangeMaxTimeRace}
                        />
                    )}
                    {!round && (
                        <>
                            <Divider style={{ width: 'calc(50ch + 16px)' }} />
                            {[TypeRound.PRACTICE, TypeRound.QUALIFICATION, TypeRound.RACE].includes(typeRound) && (
                                <>
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                        <InputLabel id="auto-generate-label">Auto generate</InputLabel>
                                        <Select<TypeGenerateRound>
                                            labelId="auto-generate-label"
                                            value={typeGenerateRound}
                                            label="Auto generate"
                                            onChange={handleChangeTypeGenerateRound}
                                        >
                                            {Object.keys(TypeGenerateRound).map((key) => (
                                                <MenuItem key={key} value={key}>
                                                    {key}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {typeGenerateRound === TypeGenerateRound.RANDOM && (
                                        <TextField
                                            label="Count sportsmen in group"
                                            value={countSportsmen}
                                            type="number"
                                            onChange={handleChangeCountSportsmen}
                                        />
                                    )}
                                    {typeGenerateRound === TypeGenerateRound.COPY_BEFORE_ROUND && (
                                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                                            <InputLabel id="auto-generate-label">Which round to copy from</InputLabel>
                                            <Select<string>
                                                labelId="auto-generate-label"
                                                value={fromRoundCopy}
                                                label="Which round to copy from"
                                                onChange={handleChangeFromRoundCopy}
                                            >
                                                {(rounds || []).map((round) => (
                                                    <MenuItem key={round._id} value={round._id}>
                                                        {round.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                </>
                            )}
                            {[TypeRound.RACE, TypeRound.FINAL].includes(typeRound) && (
                                <>
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                        <InputLabel id="type-parentEntity-label">
                                            Auto generate race elimination
                                        </InputLabel>
                                        <Select<TypeRaceElimination>
                                            labelId="type-parentEntity-label"
                                            value={typeRaceElimination}
                                            label="Auto generate race"
                                            onChange={handleChangeTypeRaceElimination}
                                        >
                                            {Object.keys(TypeRaceElimination).map((key) => (
                                                <MenuItem key={key} value={key}>
                                                    {key}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {[
                                        TypeRaceElimination.SINGLE_ELIMINATION,
                                        TypeRaceElimination.DOUBLE_ELIMINATION
                                    ].includes(typeRaceElimination) && (
                                        <>
                                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                <InputLabel id="type-parentEntity-label">Type parent entity</InputLabel>
                                                <Select<TypeParentEntity>
                                                    labelId="type-parentEntity-label"
                                                    value={typeParentEntity}
                                                    label="Type parent entity"
                                                    onChange={handleChangeTypeParentEntity}
                                                >
                                                    {Object.keys(TypeParentEntity).map((key) => (
                                                        <MenuItem key={key} value={key}>
                                                            {key}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {typeParentEntity === TypeParentEntity.ROUND && (
                                                <>
                                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                        <InputLabel id="parent-entity-label">Parent entity</InputLabel>
                                                        <Select<string>
                                                            labelId="parent-entity-label"
                                                            value={parentEntity}
                                                            label="Parent entity"
                                                            onChange={handleChangeParentEntity}
                                                        >
                                                            {(rounds || []).map((round) => (
                                                                <MenuItem key={round._id} value={round._id}>
                                                                    {round.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    <TextField
                                                        label="Number of pilots who pass on"
                                                        value={countNextGo}
                                                        type="number"
                                                        onChange={handleChangeCountNextGo}
                                                    />
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                {!!round && (
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
