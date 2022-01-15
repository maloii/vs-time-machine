import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { StopWatch } from '@/modules/rounds/components/StopWatch/StopWatch';
import { TableLaps } from '@/modules/rounds/components/TableLaps/TableLaps';
import { story } from '@/story/story';
import { getRaceStatusAction, getStartTimeAction } from '@/actions/actionRaceRequest';

export const CurrentGroupScreenBroadCastController: FC = observer(() => {
    const [startTime, setStartTime] = useState(story.startTime);
    const [raceStatus, setRaceStatus] = useState(story.raceStatus);

    useEffect(() => {
        Promise.all([getStartTimeAction(), getRaceStatusAction()]).then(([resStartTime, resRaceStatus]) => {
            setStartTime(resStartTime);
            setRaceStatus(resRaceStatus);
        });
    }, []);

    useEffect(() => {
        setStartTime(story.startTime);
        setRaceStatus(story.raceStatus);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [story.startTime, story.raceStatus]);

    console.log(startTime, raceStatus, story.startTime, story.raceStatus);
    return (
        <div>
            <StopWatch raceStatus={raceStatus} startTime={startTime} />
            <div style={{ margin: '25px' }}>
                {story.groupInRace?.round && <TableLaps round={story.groupInRace?.round} group={story.groupInRace} />}
            </div>
        </div>
    );
});
