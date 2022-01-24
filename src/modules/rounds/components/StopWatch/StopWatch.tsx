import React, { FC, useCallback, useEffect, useRef } from 'react';
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
    const refTimer = useRef<NodeJS.Timeout>();
    const refTimeRace = useRef<HTMLSpanElement>(null);
    const refTimeLeft = useRef<HTMLSpanElement>(null);

    const setTimer = useCallback(
        (timer: number) => {
            if (refTimeRace.current) {
                refTimeRace.current.innerText = millisecondsToTimeString(timer);
            }
            if (refTimeLeft.current) {
                const timeLeft = Number(round?.maxTimeRace) * 1000 - timer;
                refTimeLeft.current.innerText = millisecondsToTimeString(timeLeft > 0 ? timeLeft : 0);
            }
        },
        [round?.maxTimeRace]
    );

    useEffect(() => {
        if (raceStatus === TypeRaceStatus.RUN) {
            refTimer.current = setInterval(() => {
                if (startTime) {
                    setTimer(DateTime.now().toMillis() - startTime);
                }
            }, 82);
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
    }, [startTime, raceStatus, setTimer]);

    useEffect(() => setTimer(0), [setTimer]);

    return (
        <div className={styles.root}>
            <fieldset className={styles.timer}>
                <legend>Time race</legend>
                <span ref={refTimeRace}>00:00:000</span>
            </fieldset>
            {round &&
                [TypeRace.FIXED_TIME, TypeRace.FIXED_TIME_AND_ONE_LAP_AFTER].includes(round?.typeRace) &&
                Number(round?.maxTimeRace) > 0 && (
                    <fieldset className={styles.timer}>
                        <legend>Time left</legend>
                        <span ref={refTimeLeft}>00:00:000</span>
                    </fieldset>
                )}
        </div>
    );
});
