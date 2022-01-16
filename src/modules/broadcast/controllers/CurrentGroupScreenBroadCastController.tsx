import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { StopWatch } from '@/modules/rounds/components/StopWatch/StopWatch';
import { TableLaps } from '@/modules/rounds/components/TableLaps/TableLaps';
import { story } from '@/story/story';
import { getGroupInRaceAction, getRaceStatusAction, getStartTimeAction } from '@/actions/actionRaceRequest';
import { loadGroupByIdAction, loadGroupsAction } from '@/actions/actionGroupRequest';

import styles from './styles.module.scss';
import { IGroup } from '@/types/IGroup';

export const CurrentGroupScreenBroadCastController: FC = observer(() => {
    const [startTime, setStartTime] = useState(story.startTime);
    const [raceStatus, setRaceStatus] = useState(story.raceStatus);
    const [groupInRace, setGroupInRace] = useState(story.groupInRace);
    const [group, setGroup] = useState<IGroup | undefined>();
    const [roundInRace, setRoundInRace] = useState(story.groupInRace?.round);

    useEffect(() => {
        Promise.all([getStartTimeAction(), getRaceStatusAction(), getGroupInRaceAction()]).then(
            async ([resStartTime, resRaceStatus, resGroupInRace]) => {
                setStartTime(resStartTime);
                setRaceStatus(resRaceStatus);
                if (resGroupInRace) {
                    setGroupInRace(resGroupInRace);
                    setGroup(await loadGroupByIdAction(resGroupInRace._id));
                }
                setRoundInRace(resGroupInRace.round);
            }
        );
    }, []);

    useEffect(() => {
        if (story.startTime) setStartTime(story.startTime);
        if (story.raceStatus) setRaceStatus(story.raceStatus);
        if (story.groupInRace) {
            loadGroupByIdAction(story.groupInRace._id).then(setGroupInRace);
            setRoundInRace(story.groupInRace.round);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [story.startTime, story.raceStatus, story.groupInRace]);

    useEffect(() => {
        if (groupInRace) {
            window.api.ipcRenderer.removeAllListeners('group-update-response');
            window.api.ipcRenderer.on('group-update-response', async () => {
                setGroup(await loadGroupByIdAction(groupInRace._id));
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupInRace]);

    return (
        <div className={styles.root}>
            <div className={styles.stopWatch}>
                <StopWatch round={groupInRace?.round} raceStatus={raceStatus} startTime={startTime} />
            </div>
            <div className={styles.race}>
                {roundInRace && groupInRace && group && (
                    <>
                        <h2 className={styles.raceHeader}>{`${roundInRace.name} - ${groupInRace.name}`}</h2>
                        <TableLaps round={roundInRace} group={group} readonly />
                    </>
                )}
            </div>
        </div>
    );
});
