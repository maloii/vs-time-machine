import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { IGate } from '@/types/IGate';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField
} from '@mui/material';
import { TypeGate } from '@/types/TypeGate';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';

interface IProps {
    open: boolean;
    onClose: () => void;
    onSave: (gate: Omit<IGate, '_id'>) => void;
    onUpdate: (_id: string, gate: Omit<IGate, '_id'>) => void;
    onDelete: (_id: string) => void;
    gate?: IGate;
    gates: IGate[];
}

export const DialogGateEdit: FC<IProps> = ({ open, onClose, gate, onSave, onUpdate, onDelete, gates }: IProps) => {
    const [type, setType] = useState<TypeGate>(gate?.type || TypeGate.FINISH);
    const [number, setNumber] = useState(gate?.number);
    const [position, setPosition] = useState(gate?.position || (gates || []).length + 1);
    const [distance, setDistance] = useState(gate?.distance);
    const [delay, setDelay] = useState(gate?.delay || 10);
    const [anyNumber, setAnyNumber] = useState<boolean>(!gate?.number);
    const [availableGates, setAvailableGates] = useState<string[]>([]);

    const handleChangeTypeGate = useCallback((event: SelectChangeEvent<TypeGate>) => {
        const newType = event.target.value as TypeGate;
        if (newType !== TypeGate.FINISH) {
            setAnyNumber(false);
            setNumber(1);
        }
        setType(newType);
    }, []);

    const handleChangeAnyNumber = useCallback(
        (_event: React.ChangeEvent<HTMLInputElement>) => {
            const newAnyNumber = !anyNumber;
            if (!newAnyNumber) {
                setNumber(1);
            } else {
                setNumber(undefined);
            }
            setAnyNumber(newAnyNumber);
        },
        [anyNumber]
    );

    const handleChangeNumber = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(Number(event.target.value));
    }, []);

    const handleChangeDistance = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setDistance(Number(event.target.value));
    }, []);

    const handleChangePosition = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPosition(Number(event.target.value));
    }, []);

    const handleChangeDelay = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setDelay(Number(event.target.value));
    }, []);

    const handleSave = useCallback(() => {
        const newGate = {
            type,
            number,
            position,
            distance,
            delay
        };
        if (gate) {
            onUpdate(gate._id, newGate);
        } else {
            onSave(newGate);
        }
    }, [delay, distance, gate, number, onSave, onUpdate, position, type]);

    const handleDelete = useCallback(() => {
        if (gate) {
            onDelete(gate._id);
        }
    }, [gate, onDelete]);

    useEffect(() => {
        const newAvailableGates: string[] = Object.keys(TypeGate).filter((key) => {
            if (key === TypeGate.GATE.toString()) return key;
            return !(gates || []).map((item) => item.type.toString()).includes(key);
        });
        setAvailableGates(newAvailableGates);
        const newType = gate?.type || TypeGate[newAvailableGates[0] as keyof typeof TypeGate];
        setType(newType);
    }, [gate?.number, gate?.type, gates]);

    const disabled = useMemo(() => {
        return type !== TypeGate.FINISH && !number;
    }, [number, type]);
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{gate ? 'Edit' : 'New'} gate</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="auto-generate-label">Type gate</InputLabel>
                        <Select<TypeGate>
                            labelId="auto-generate-label"
                            value={type}
                            label="Type gate"
                            onChange={handleChangeTypeGate}
                        >
                            {availableGates.map((key) => (
                                <MenuItem key={key} value={TypeGate[key as keyof typeof TypeGate]}>
                                    {key}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {type === TypeGate.FINISH && (
                        <FormControlLabel
                            control={<Switch checked={anyNumber} onChange={handleChangeAnyNumber} />}
                            label="Any number gate"
                        />
                    )}
                    {(!anyNumber || type !== TypeGate.FINISH) && (
                        <TextField
                            id="outlined-basic"
                            label="Number gate"
                            fullWidth
                            variant="outlined"
                            value={number + ''}
                            type="number"
                            error={!number}
                            InputProps={{ inputProps: { min: 1, max: 64 } }}
                            onChange={handleChangeNumber}
                        />
                    )}
                    <TextField
                        id="outlined-basic"
                        label="Distance gate (meters)"
                        fullWidth
                        variant="outlined"
                        value={distance}
                        type="number"
                        onChange={handleChangeDistance}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Position gate"
                        fullWidth
                        variant="outlined"
                        value={position}
                        type="number"
                        onChange={handleChangePosition}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Delay gate (sec)"
                        fullWidth
                        variant="outlined"
                        value={delay}
                        type="number"
                        onChange={handleChangeDelay}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                {!!gate && (
                    <Button onClick={handleDelete} style={{ marginRight: 'auto' }} color="error">
                        Delete
                    </Button>
                )}
                <Button onClick={onClose}>Close</Button>
                <Button onClick={handleSave} disabled={disabled}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
