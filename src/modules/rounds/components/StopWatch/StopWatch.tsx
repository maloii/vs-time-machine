import React, { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { DateTime } from 'luxon';
import { Paper } from '@mui/material';
import { IRound } from '@/types/IRound';
import { TypeRaceStatus } from '@/types/TypeRaceStatus';
import { millisecondsToTimeString } from '@/utils/millisecondsToTimeString';

import styles from './styles.module.scss';

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
        <div>
            <Paper className={styles.timer}>{millisecondsToTimeString(timer)}</Paper>
        </div>
    );
});
