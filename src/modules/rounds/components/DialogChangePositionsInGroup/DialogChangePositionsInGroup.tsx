import React, { FC, useCallback, useState } from 'react';
import _ from 'lodash';
import { IGroup } from '@/types/IGroup';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { sportsmanName } from '@/utils/sportsmanName';

interface IProps {
    open: boolean;
    group: IGroup;
    onClose: () => void;
    onUpdate: (
        _id: string,
        group: Omit<IGroup, '_id' | 'competitionId' | 'roundId' | 'close' | 'sort' | 'timeStart'>
    ) => void;
}

export const DialogChangePositionsInGroup: FC<IProps> = ({ open, group, onClose, onUpdate }: IProps) => {
    const [innerGroup, setInnerGroup] = useState<IGroup>(_.cloneDeep(group));
    const handleChangePosition = useCallback(
        (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setInnerGroup({
                ...innerGroup,
                sportsmen: innerGroup.sportsmen?.map((sportsman) => {
                    if (sportsman._id === id) return { ...sportsman, position: Number(event.target.value) };
                    return sportsman;
                }),
                teams: innerGroup.teams?.map((team) => {
                    if (team._id === id) return { ...team, position: Number(event.target.value) };
                    return team;
                })
            });
        },
        [innerGroup]
    );
    const handleUpdate = useCallback(() => onUpdate(group._id, innerGroup), [group._id, innerGroup, onUpdate]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit position sportsmen in group</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1 }
                    }}
                    noValidate
                    autoComplete="off"
                >
                    {[...innerGroup?.teams, ...innerGroup?.sportsmen].map((item) => (
                        <TextField
                            key={item._id}
                            type="number"
                            fullWidth
                            label={item.team?.name || sportsmanName(item?.sportsman!)}
                            value={item.position}
                            onChange={handleChangePosition(item._id)}
                        />
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button onClick={handleUpdate}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};
