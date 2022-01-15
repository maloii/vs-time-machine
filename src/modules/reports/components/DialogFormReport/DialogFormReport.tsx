import React, { FC, useCallback, useState } from 'react';
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
import { IReport } from '@/types/IReport';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { TypeReport } from '@/types/TypeReport';
import _ from 'lodash';
import { TypeRoundReport } from '@/types/TypeRoundReport';

interface IProps {
    open: boolean;
    onClose: () => void;
    onSave: (report: Omit<IReport, '_id'>) => void;
    onUpdate: (_id: string, report: Omit<IReport, '_id'>) => void;
    onDelete: (_id: string) => void;
    report?: IReport;
}

export const DialogFormReport: FC<IProps> = ({ open, onClose, onSave, onUpdate, onDelete, report }: IProps) => {
    const [name, setName] = useState(report?.name || '');
    const [type, setType] = useState(report?.type || TypeReport.BEST_LAP);
    const [typeRound, setTypeRound] = useState(report?.typeRound || TypeRoundReport.PRACTICE);
    const [notCountedRounds, setNotCountedRounds] = useState(report?.notCountedRounds || 1);
    const [onlySportsmen, setOnlySportsmen] = useState(report?.onlySportsmen || false);

    const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);
    const handleChangeType = useCallback((event: SelectChangeEvent<TypeReport>) => {
        setType(event.target.value as TypeReport);
    }, []);
    const handleChangeTypeRound = useCallback((event: SelectChangeEvent<TypeRoundReport>) => {
        setTypeRound(event.target.value as TypeRoundReport);
    }, []);
    const handleChangeNotCountedRounds = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setNotCountedRounds(Number(event.target.value));
    }, []);
    const handleChangeOnlySportsmen = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setOnlySportsmen((prev) => !prev);
    }, []);

    const handleSave = useCallback(() => {
        const newReport = {
            name,
            type,
            typeRound,
            notCountedRounds,
            onlySportsmen
        };
        if (report?._id) {
            onUpdate(report?._id, _.cloneDeep(newReport));
        } else {
            onSave(newReport);
        }
    }, [name, type, typeRound, notCountedRounds, onlySportsmen, report?._id, onUpdate, onSave]);

    const handleDelete = useCallback(() => {
        if (report) {
            onDelete(report._id);
        }
    }, [onDelete, report]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{report ? 'Edit' : 'New'} report</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1 }
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField fullWidth label="Name" error={!name} value={name} onChange={handleChangeName} />
                    <FormControl fullWidth>
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select<TypeReport> labelId="type-label" value={type} label="Type" onChange={handleChangeType}>
                            {Object.keys(TypeReport).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {key}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {[TypeReport.BEST_LAP, TypeReport.COUNT_LAPS].includes(type) && (
                        <FormControl fullWidth>
                            <InputLabel id="type-round-label">Type round</InputLabel>
                            <Select<TypeRoundReport>
                                labelId="type-round-label"
                                value={typeRound}
                                label="Type round"
                                onChange={handleChangeTypeRound}
                            >
                                {Object.keys(TypeRoundReport).map((key) => (
                                    <MenuItem key={key} value={key}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    {type === TypeReport.BEST_LAP && (
                        <FormControlLabel
                            control={<Switch checked={onlySportsmen} onChange={handleChangeOnlySportsmen} />}
                            label="Only sportsmen"
                        />
                    )}
                    {type === TypeReport.COUNT_LAPS && (
                        <TextField
                            fullWidth
                            label="Number of failed rounds not counted"
                            type="number"
                            value={notCountedRounds}
                            onChange={handleChangeNotCountedRounds}
                        />
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                {!!report && (
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
