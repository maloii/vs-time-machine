import React, { FC, useCallback, useState } from 'react';
import { IMembersGroup } from '@/types/IGroup';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { PositionColor } from '@/modules/competition/components/DialogCompetitionEdit/PositionColor';
import { Color } from '@/types/Color';
import { Channel } from '@/types/VTXChannel';
import { PositionChannel } from '@/modules/competition/components/DialogCompetitionEdit/PositionChannel';

interface IProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (_id: string, color: Color, channel: Channel) => void;
    membersGroup: IMembersGroup;
}

export const DialogFormMembersGroup: FC<IProps> = ({ open, onClose, membersGroup, onUpdate }: IProps) => {
    const [color, setColor] = useState(membersGroup.color || Color.BLACK);
    const [channel, setChannel] = useState(membersGroup.channel || Channel.A1);

    const handleSave = useCallback(() => {
        onUpdate(membersGroup._id, color, channel);
    }, [channel, color, membersGroup, onUpdate]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Members in group</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1 }
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <PositionColor value={color} onChange={setColor} label="Цвет" />
                    <PositionChannel value={channel} onChange={setChannel} label="Канал" />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};
