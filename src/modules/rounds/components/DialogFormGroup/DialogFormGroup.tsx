import React, { FC, useCallback, useState } from 'react';
import _ from 'lodash';
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
import { IGroup, IMembersGroup } from '@/types/IGroup';
import { ISportsman } from '@/types/ISportsman';
import { ITeam } from '@/types/ITeam';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { TypeGroup } from '@/types/TypeGroup';
import { ICompetition } from '@/types/ICompetition';

interface IProps {
    open: boolean;
    onClose: () => void;
    onSave: (group: Omit<IGroup, '_id' | 'competitionId' | 'roundId' | 'close' | 'sort' | 'timeStart'>) => void;
    onUpdate: (
        _id: string,
        group: Omit<IGroup, '_id' | 'competitionId' | 'roundId' | 'close' | 'sort' | 'timeStart'>
    ) => void;
    onDelete: (_id: string) => void;
    group?: IGroup;
    groups: IGroup[];
    sportsmen: ISportsman[];
    teams: ITeam[];
    competition: ICompetition;
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
    teams,
    competition
}: IProps) => {
    const [name, setName] = useState(group?.name || `Group ${(groups || []).length > 0 ? groups.length + 1 : '1'}`);
    const [typeGroup, setTypeGroup] = useState(group?.typeGroup || TypeGroup.NONE);
    const [sportsmenMembers, setSportsmenMembers] = useState<Array<IMembersGroup>>(group?.sportsmen || []);
    const [teamsMembers, setTeamsMembers] = useState<Array<IMembersGroup>>(group?.teams || []);

    const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);
    const handleChangeTypeGroup = useCallback((event: SelectChangeEvent<TypeGroup>) => {
        setTypeGroup(event.target.value as TypeGroup);
    }, []);
    const handleChangeSportsmenIds = useCallback(
        (event: SelectChangeEvent<Array<string>>) => {
            setSportsmenMembers(
                (event.target.value as string[]).map((_id, indx) => {
                    const startNumber = indx + 1;
                    const colorAndChannel = window.api.competitionColorAndChannel(
                        startNumber,
                        _.cloneDeep(competition)
                    );
                    return {
                        _id,
                        startNumber,
                        color: colorAndChannel?.color,
                        channel: colorAndChannel?.channel
                    };
                })
            );
        },
        [competition]
    );

    const handleChangeTeamsIds = useCallback(
        (event: SelectChangeEvent<Array<string>>) => {
            setTeamsMembers(
                (event.target.value as string[]).map((_id, indx) => {
                    const startNumber = indx + 1;
                    const colorAndChannel = window.api.competitionColorAndChannel(
                        startNumber,
                        _.cloneDeep(competition)
                    );
                    return {
                        _id,
                        startNumber,
                        color: colorAndChannel?.color,
                        channel: colorAndChannel?.channel
                    };
                })
            );
        },
        [competition]
    );

    const handleSave = useCallback(() => {
        const newDataGroup = {
            name,
            typeGroup,
            sportsmen: sportsmenMembers,
            teams: teamsMembers
        };
        if (group?._id) {
            onUpdate(group?._id, _.cloneDeep({ ...newDataGroup, selected: group.selected }));
        } else {
            onSave({ ...newDataGroup, selected: true });
        }
    }, [name, typeGroup, sportsmenMembers, teamsMembers, group?._id, group?.selected, onUpdate, onSave]);

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
                            value={sportsmenMembers.map((item) => item._id)}
                            label="Sportsmen"
                            multiple
                            onChange={handleChangeSportsmenIds}
                        >
                            {(sportsmen || [])
                                .filter((sportsman) => sportsman.selected)
                                .map((sportsman) => (
                                    <MenuItem
                                        key={sportsman._id}
                                        value={sportsman._id}
                                        selected={sportsmenMembers.map((item) => item._id).includes(sportsman._id)}
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
                            value={teamsMembers.map((item) => item._id)}
                            label="Teams"
                            multiple
                            onChange={handleChangeTeamsIds}
                        >
                            {(teams || [])
                                .filter((teams) => teams.selected)
                                .map((team) => (
                                    <MenuItem
                                        key={team._id}
                                        value={team._id}
                                        selected={teamsMembers.map((item) => item._id).includes(team._id)}
                                    >
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
