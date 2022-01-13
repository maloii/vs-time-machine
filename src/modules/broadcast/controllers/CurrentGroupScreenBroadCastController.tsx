import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import { StopWatch } from '@/modules/rounds/components/StopWatch/StopWatch';
import { TableLaps } from '@/modules/rounds/components/TableLaps/TableLaps';
import { story } from '@/story/story';
import { loadGroupsAction } from '@/actions/actionGroupRequest';

export const CurrentGroupScreenBroadCastController: FC = observer(() => {
    return (
        <div>
            <StopWatch raceStatus={story.raceStatus} startTime={story.startTime} />
            <div style={{ margin: '25px' }}>
                {story.groupInRace?.round && <TableLaps round={story.groupInRace?.round} group={story.groupInRace} />}
            </div>
        </div>
    );
});
