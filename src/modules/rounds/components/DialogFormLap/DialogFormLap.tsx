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
    Select
} from '@mui/material';
import { ILap } from '@/types/ILap';
import { TypeLap } from '@/types/TypeLap';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';

interface IProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (_id: string, lap: Pick<ILap, 'typeLap'>) => void;
    lap?: ILap;
    onDelete: (_id: string) => () => void;
}

export const DialogFormLap: FC<IProps> = ({ open, onClose, onUpdate, lap, onDelete }: IProps) => {
    const [typeLap, setTypeLap] = useState(lap?.typeLap || TypeLap.OK);

    const handleChangeTypeLap = useCallback((event: SelectChangeEvent<TypeLap>) => {
        setTypeLap(event.target.value as TypeLap);
    }, []);

    const handleSave = useCallback(() => {
        if (lap?._id) onUpdate(lap._id, { typeLap });
    }, [lap?._id, onUpdate, typeLap]);

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
