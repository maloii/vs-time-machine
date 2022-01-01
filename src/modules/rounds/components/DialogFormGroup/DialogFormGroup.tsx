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
import { IGroup } from '@/types/IGroup';
import { ISportsman } from '@/types/ISportsman';
import { ITeam } from '@/types/ITeam';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { TypeGroup } from '@/types/TypeGroup';

interface IProps {
    open: boolean;
    onClose: () => void;
    onSave: (group: Omit<IGroup, '_id' | 'roundId' | 'close' | 'sort' | 'timeStart' | 'startMillisecond'>) => void;
    onUpdate: (
        _id: string,
        group: Omit<IGroup, '_id' | 'roundId' | 'close' | 'sort' | 'timeStart' | 'startMillisecond'>
    ) => void;
    onDelete: (_id: string) => void;
    group?: IGroup;
    groups: IGroup[];
    sportsmen: ISportsman[];
    teams: ITeam[];
}

export const DialogFormGroup: FC<IProps> = ({
    open,
    onClose,
    onSave,
    onUpdate,
    onDelete,
    group,
    groups,
    sportsmen,
    teams
}: IProps) => {
    const [name, setName] = useState(group?.name || `Group ${(groups || []).length > 0 ? groups.length + 1 : '1'}`);
    const [typeGroup, setTypeGroup] = useState(group?.typeGroup || TypeGroup.NONE);
    const [sportsmenIds, setSportsmenIds] = useState<Array<string>>(group?.sportsmenIds || []);
    const [teamsIds, setTeamsIds] = useState<Array<string>>(group?.teamsIds || []);

    const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);
    const handleChangeTypeGroup = useCallback((event: SelectChangeEvent<TypeGroup>) => {
        setTypeGroup(event.target.value as TypeGroup);
    }, []);
    const handleChangeSportsmenIds = useCallback((event: SelectChangeEvent<Array<string>>) => {
        setSportsmenIds(event.target.value as string[]);
    }, []);
    const handleChangeTeamsIds = useCallback((event: SelectChangeEvent<Array<string>>) => {
        setTeamsIds(event.target.value as string[]);
    }, []);

    const handleSave = useCallback(() => {
        const newDataGroup = {
            name,
            typeGroup,
            sportsmenIds,
            teamsIds
        };
        if (group?._id) {
            onUpdate(group?._id, { ...newDataGroup, selected: group.selected });
        } else {
            onSave({ ...newDataGroup, selected: true });
        }
    }, [group?._id, group?.selected, name, typeGroup, onSave, onUpdate, sportsmenIds, teamsIds]);

    const handleDelete = useCallback(() => {
        if (group && window.confirm('Are you sure you want to delete the group? All laps will be deleted with him!')) {
            onDelete(group._id);
        }
    }, [onDelete, group]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{group ? 'Edit' : 'New'} group</DialogTitle>
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
                        <InputLabel id="type-group-label">Type group</InputLabel>
                        <Select<TypeGroup>
                            labelId="type-group-label"
                            value={typeGroup}
                            label="Type group"
                            onChange={handleChangeTypeGroup}
                        >
                            {Object.keys(TypeGroup).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {key}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="sportsmen-label">Sportsmen</InputLabel>
                        <Select<Array<string>>
                            labelId="sportsmen-label"
                            value={sportsmenIds}
                            label="Sportsmen"
                            multiple
                            onChange={handleChangeSportsmenIds}
                        >
                            {(sportsmen || []).map((sportsman) => (
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
                    <FormControl fullWidth>
                        <InputLabel id="teams-label">Teams</InputLabel>
                        <Select<Array<string>>
                            labelId="teams-label"
                            value={teamsIds}
                            label="Teams"
                            multiple
                            onChange={handleChangeTeamsIds}
                        >
                            {(teams || []).map((team) => (
                                <MenuItem key={team._id} value={team._id} selected={teamsIds.includes(team._id)}>
                                    {team.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                {!!group && (
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
