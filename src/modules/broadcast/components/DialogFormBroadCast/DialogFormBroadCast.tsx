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
import { IReport } from '@/types/IReport';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { IBroadCast } from '@/types/IBroadCast';
import { TypeChromaKey } from '@/types/TypeChromaKey';

interface IProps {
    open: boolean;
    onClose: () => void;
    onSave: (report: Omit<IBroadCast, '_id'>) => void;
    onUpdate: (_id: string, broadCast: Omit<IBroadCast, '_id'>) => void;
    onDelete: (_id: string) => void;
    reports: IReport[];
    broadCast?: IBroadCast;
}

export const DialogFormBroadCast: FC<IProps> = ({
    open,
    onClose,
    onSave,
    onUpdate,
    onDelete,
    reports,
    broadCast
}: IProps) => {
    const [name, setName] = useState(broadCast?.name);
    const [top, setTop] = useState(broadCast?.top);
    const [left, setLeft] = useState(broadCast?.left);
    const [center, setCenter] = useState(broadCast?.center);
    const [right, setRight] = useState(broadCast?.right);
    const [bottom, setBottom] = useState(broadCast?.bottom);
    const [chromaKey, setChromaKey] = useState(broadCast?.chromaKey || TypeChromaKey.NONE);

    const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);
    const handleChangeChromaKey = useCallback((event: SelectChangeEvent<TypeChromaKey>) => {
        setChromaKey(event.target.value as TypeChromaKey);
    }, []);

    const handleChangeTop = useCallback((event: SelectChangeEvent) => {
        setTop(event.target.value);
    }, []);

    const handleChangeLeft = useCallback((event: SelectChangeEvent) => {
        setLeft(event.target.value);
    }, []);

    const handleChangeCenter = useCallback((event: SelectChangeEvent) => {
        setCenter(event.target.value);
    }, []);

    const handleChangeRight = useCallback((event: SelectChangeEvent) => {
        setRight(event.target.value);
    }, []);

    const handleChangeBottom = useCallback((event: SelectChangeEvent) => {
        setBottom(event.target.value);
    }, []);

    const handleSave = useCallback(() => {
        const newBroadCast = {
            name,
            top,
            left,
            center,
            right,
            bottom,
            chromaKey
        };
        if (broadCast?._id) {
            onUpdate(broadCast?._id, newBroadCast as IBroadCast);
        } else {
            onSave(newBroadCast as IBroadCast);
        }
    }, [name, top, left, center, right, bottom, chromaKey, broadCast?._id, onUpdate, onSave]);

    const handleDelete = useCallback(() => {
        if (broadCast) {
            onDelete(broadCast._id);
        }
    }, [onDelete, broadCast]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{broadCast ? 'Edit' : 'New'} broadcast</DialogTitle>
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
                        <InputLabel id="chroma-key-label">Chroma key</InputLabel>
                        <Select<TypeChromaKey>
                            labelId="chroma-key-label"
                            value={chromaKey}
                            label="Chroma key"
                            onChange={handleChangeChromaKey}
                        >
                            {Object.keys(TypeChromaKey).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {key}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="center-label">Center</InputLabel>
                        <Select labelId="center-label" value={center} label="Center" onChange={handleChangeCenter}>
                            <MenuItem value={undefined}>NONE</MenuItem>
                            {reports.map((report) => (
                                <MenuItem key={report._id} value={report._id}>
                                    {report.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="left-label">Left</InputLabel>
                        <Select labelId="left-label" value={left} label="Left" onChange={handleChangeLeft}>
                            <MenuItem value={undefined}>NONE</MenuItem>
                            {reports.map((report) => (
                                <MenuItem key={report._id} value={report._id}>
                                    {report.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="right-label">Right</InputLabel>
                        <Select labelId="right-label" value={right} label="Right" onChange={handleChangeRight}>
                            <MenuItem value={undefined}>NONE</MenuItem>
                            {reports.map((report) => (
                                <MenuItem key={report._id} value={report._id}>
                                    {report.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="top-label">Top</InputLabel>
                        <Select labelId="top-label" value={left} label="Top" onChange={handleChangeTop}>
                            <MenuItem value={undefined}>NONE</MenuItem>
                            {reports.map((report) => (
                                <MenuItem key={report._id} value={report._id}>
                                    {report.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="bottom-label">Bottom</InputLabel>
                        <Select labelId="bottom-label" value={bottom} label="Bottom" onChange={handleChangeBottom}>
                            <MenuItem value={undefined}>NONE</MenuItem>
                            {reports.map((report) => (
                                <MenuItem key={report._id} value={report._id}>
                                    {report.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                {!!broadCast && (
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
