import React, { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { DateTime } from 'luxon';
import { IRound } from '@/types/IRound';
import { TypeRaceStatus } from '@/types/TypeRaceStatus';
import { millisecondsToTimeString } from '@/utils/millisecondsToTimeString';

import styles from './styles.module.scss';
import { TypeRace } from '@/types/TypeRace';

interface IProps {
    round?: IRound;
    startTime?: number;
    raceStatus?: TypeRaceStatus;
}

export const StopWatch: FC<IProps> = observer(({ round, startTime, raceStatus }: IProps) => {
    const [timer, setTimer] = useState(0);
    const refTimer = useRef<NodeJS.Timeout>();
    useEffect(() => {
        if (raceStatus === TypeRaceStatus.RUN) {
            refTimer.current = setInterval(() => {
                if (startTime) {
                    setTimer(DateTime.now().toMillis() - startTime);
                }
            }, 10);
        }
        if (raceStatus === TypeRaceStatus.STOP) {
            if (refTimer.current) {
                clearInterval(refTimer.current);
            }
        }
        if (raceStatus && [TypeRaceStatus.READY, TypeRaceStatus.SEARCH].includes(raceStatus)) {
            setTimer(0);
        }
        return () => {
            if (refTimer.current) {
                clearInterval(refTimer.current);
            }
        };
    }, [startTime, raceStatus]);
    return (
        <div className={styles.root}>
            <fieldset className={styles.timer}>
                <legend>Time race</legend>
                {millisecondsToTimeString(timer)}
            </fieldset>
            {round &&
                [TypeRace.FIXED_TIME, TypeRace.FIXED_TIME_AND_ONE_LAP_AFTER].includes(round?.typeRace) &&
                Number(round?.maxTimeRace) > 0 && (
                    <fieldset className={styles.timer}>
                        <legend>Time left</legend>
                        {millisecondsToTimeString(Number(round?.maxTimeRace) * 1000 - timer)}
                    </fieldset>
                )}
        </div>
    );
});
