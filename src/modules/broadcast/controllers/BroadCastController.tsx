import React, { FC, useCallback } from 'react';
import { Button } from '@mui/material';
import { openCurrentGroupBroadCastAction } from '@/actions/actionBroadcastRequest';

export const BroadCastController: FC = () => {
    const handleCurrentGroupScreen = useCallback(() => openCurrentGroupBroadCastAction(), []);
    return (
        <div>
            <Button onClick={handleCurrentGroupScreen}>Current group screen</Button>
        </div>
    );
};
