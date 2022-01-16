import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { StopWatch } from '@/modules/rounds/components/StopWatch/StopWatch';
import { TableLaps } from '@/modules/rounds/components/TableLaps/TableLaps';
import { story } from '@/story/story';
import { getGroupInRaceAction, getRaceStatusAction, getStartTimeAction } from '@/actions/actionRaceRequest';

import styles from './styles.module.scss';

export const CurrentGroupScreenBroadCastController: FC = observer(() => {
    const [startTime, setStartTime] = useState(story.startTime);
    const [raceStatus, setRaceStatus] = useState(story.raceStatus);
    const [groupInRace, setGroupInRace] = useState(story.groupInRace);

    useEffect(() => {
        Promise.all([getStartTimeAction(), getRaceStatusAction(), getGroupInRaceAction()]).then(
            ([resStartTime, resRaceStatus, resGroupInRace]) => {
                setStartTime(resStartTime);
                setRaceStatus(resRaceStatus);
                setGroupInRace(resGroupInRace);
            }
        );
    }, []);

    useEffect(() => {
        if (story.startTime) setStartTime(story.startTime);
        if (story.raceStatus) setRaceStatus(story.raceStatus);
        if (story.groupInRace) setGroupInRace(story.groupInRace);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [story.startTime, story.raceStatus, story.groupInRace]);

    return (
        <div className={styles.root}>
            <div className={styles.stopWatch}>
                <StopWatch round={groupInRace?.round} raceStatus={raceStatus} startTime={startTime} />
            </div>
            <div className={styles.race}>
                {groupInRace?.round && (
                    <>
                        <h2 className={styles.raceHeader}>{`${groupInRace?.round.name} - ${groupInRace.name}`}</h2>
                        <TableLaps round={groupInRace?.round} group={groupInRace} readonly />
                    </>
                )}
            </div>
        </div>
    );
});
