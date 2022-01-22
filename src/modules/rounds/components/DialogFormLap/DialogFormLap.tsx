import React, { FC, useCallback, useState } from 'react';
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
import { ILap } from '@/types/ILap';
import { TypeLap } from '@/types/TypeLap';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { IGate } from '@/types/IGate';

interface IProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (_id: string, lap: Pick<ILap, 'typeLap' | 'gateId' | 'timeLap'>) => void;
    memberGroupId: string;
    lap?: ILap;
    beforeLap?: ILap;
    afterLap?: ILap;
    gates: IGate[];
    onDelete: (_id: string) => () => void;
    onAdd: (
        memberGroupId: string,
        lap: Pick<ILap, 'typeLap' | 'gateId' | 'timeLap'>,
        beforeLap?: ILap,
        afterLap?: ILap
    ) => void;
}

export const DialogFormLap: FC<IProps> = ({
    open,
    onClose,
    onUpdate,
    memberGroupId,
    lap,
    beforeLap,
    afterLap,
    onDelete,
    gates,
    onAdd
}: IProps) => {
    const [typeLap, setTypeLap] = useState(lap?.typeLap || TypeLap.OK);
    const [gateId, setGateId] = useState(lap?.gateId || gates?.[0]?._id);
    const [timeLap, setTimeLap] = useState(lap?.timeLap || 10000);

    const handleChangeTypeLap = useCallback((event: SelectChangeEvent<TypeLap>) => {
        setTypeLap(event.target.value as TypeLap);
    }, []);
    const handleChangeGate = useCallback((event: SelectChangeEvent) => {
        setGateId(event.target.value);
    }, []);
    const handleChangeTimeLap = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeLap(Number(event.target.value));
    }, []);

    const handleSave = useCallback(() => {
        const tempLap = { typeLap, gateId, timeLap };
        if (lap?._id) {
            onUpdate(lap._id, tempLap);
        } else {
            onAdd(memberGroupId, tempLap, beforeLap, afterLap);
        }
    }, [typeLap, gateId, timeLap, lap?._id, onUpdate, onAdd, memberGroupId, beforeLap, afterLap]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{lap ? 'Edit' : 'New'} lap</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1 }
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        type="number"
                        fullWidth
                        label="Time lap"
                        error={!timeLap}
                        value={timeLap}
                        onChange={handleChangeTimeLap}
                        helperText="In milliseconds"
                    />
                    <FormControl fullWidth>
                        <InputLabel id="type-lap-label">Type lap</InputLabel>
                        <Select<TypeLap>
                            labelId="type-lap-label"
                            value={typeLap}
                            label="Type lap"
                            onChange={handleChangeTypeLap}
                        >
                            {Object.keys(TypeLap).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {key}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="gate-label">Gate</InputLabel>
                        <Select labelId="gate-label" value={gateId} label="Gate" onChange={handleChangeGate}>
                            {(gates || []).map((gate) => (
                                <MenuItem key={gate._id} value={gate._id}>
                                    {`${gate.number || ''} - ${gate.type}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                {!!lap && (
                    <Button onClick={onDelete(lap._id)} style={{ marginRight: 'auto' }} color="error">
                        Delete
                    </Button>
                )}
                <Button onClick={onClose}>Close</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};
