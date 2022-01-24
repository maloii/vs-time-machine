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
    ListSubheader,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import { IReport } from '@/types/IReport';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { IBroadCast } from '@/types/IBroadCast';
import { TypeChromaKey } from '@/types/TypeChromaKey';
import { TypeBroadCastComponents } from '@/types/TypeBroadCastComponents';

interface IProps {
    open: boolean;
    onClose: () => void;
    onSave: (report: Omit<IBroadCast, '_id' | 'competitionId'>) => void;
    onUpdate: (_id: string, broadCast: Omit<IBroadCast, '_id' | 'competitionId'>) => void;
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
    const [left2, setLeft2] = useState(broadCast?.left2);
    const [center, setCenter] = useState(broadCast?.center);
    const [center2, setCenter2] = useState(broadCast?.center2);
    const [right, setRight] = useState(broadCast?.right);
    const [right2, setRight2] = useState(broadCast?.right2);
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

    const handleChangeLeft2 = useCallback((event: SelectChangeEvent) => {
        setLeft2(event.target.value);
    }, []);

    const handleChangeCenter = useCallback((event: SelectChangeEvent) => {
        setCenter(event.target.value);
    }, []);

    const handleChangeCenter2 = useCallback((event: SelectChangeEvent) => {
        setCenter2(event.target.value);
    }, []);

    const handleChangeRight = useCallback((event: SelectChangeEvent) => {
        setRight(event.target.value);
    }, []);

    const handleChangeRight2 = useCallback((event: SelectChangeEvent) => {
        setRight2(event.target.value);
    }, []);

    const handleChangeBottom = useCallback((event: SelectChangeEvent) => {
        setBottom(event.target.value);
    }, []);

    const handleSave = useCallback(() => {
        const newBroadCast = {
            name,
            top,
            left,
            left2,
            center,
            center2,
            right,
            right2,
            bottom,
            chromaKey
        };
        if (broadCast?._id) {
            onUpdate(broadCast?._id, newBroadCast as IBroadCast);
        } else {
            onSave(newBroadCast as IBroadCast);
        }
    }, [name, top, left, left2, center, center2, right, right2, bottom, chromaKey, broadCast?._id, onUpdate, onSave]);

    const handleDelete = useCallback(() => {
        if (broadCast) {
            onDelete(broadCast._id);
        }
    }, [onDelete, broadCast]);

    const selectForPosition = (
        title: string,
        value: string | undefined,
        onChange: (event: SelectChangeEvent) => void
    ) => (
        <FormControl fullWidth>
            <InputLabel id="select-label">{title}</InputLabel>
            <Select labelId="select-label" value={value} label={title} onChange={onChange}>
                <MenuItem value={undefined}>NONE</MenuItem>
                <ListSubheader>Screen</ListSubheader>
                {Object.keys(TypeBroadCastComponents).map((key) => (
                    <MenuItem key={key} value={key}>
                        {key}
                    </MenuItem>
                ))}
                <ListSubheader>Reports</ListSubheader>
                {reports.map((report) => (
                    <MenuItem key={report._id} value={report._id}>
                        {report.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
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
                    {selectForPosition('Top', top, handleChangeTop)}
                    {selectForPosition('Left', left, handleChangeLeft)}
                    {selectForPosition('Left 2', left2, handleChangeLeft2)}
                    {selectForPosition('Center', center, handleChangeCenter)}
                    {selectForPosition('Center 2', center2, handleChangeCenter2)}
                    {selectForPosition('Right', right, handleChangeRight)}
                    {selectForPosition('Right 2', right2, handleChangeRight2)}
                    {selectForPosition('Bottom', bottom, handleChangeBottom)}
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
