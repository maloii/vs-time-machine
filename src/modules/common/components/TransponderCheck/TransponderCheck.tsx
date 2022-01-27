import React, { FC, useCallback, useEffect, useState } from 'react';
import { IconButton, Paper } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { story } from '@/story/story';
import { ISportsman } from '@/types/ISportsman';
import { sportsmanName } from '@/utils/sportsmanName';

import styles from './styles.module.scss';

export const TransponderCheck: FC = observer(() => {
    const [transponder, setTransponder] = useState<string>();
    const [numberPackage, setNumberPackager] = useState<string>();
    const [gateNumber, setGateNumber] = useState<string>();
    const [startNumber, setStartNumber] = useState<string>();
    const [sportsman, setSportsman] = useState<ISportsman | undefined>(undefined);

    const handleCopy = useCallback(
        (tr: string) => async () => {
            await navigator.clipboard.writeText(tr);
        },
        []
    );

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
        window.api.ipcRenderer.removeAllListeners('lap-data-receive');
        window.api.ipcRenderer.on(
            'lap-data-receive',
            (
                e: any,
                _lapTime: number,
                _transponder: string,
                _numberPackage: string,
                _gateNumber: string,
                _startNumber: string
            ) => {
                const _sportsman = _.find(story.sportsmen || [], (sportsman) =>
                    (sportsman.transponders || []).map((item) => Number(item)).includes(Number(_transponder))
                );
                setSportsman(_sportsman);
                setTransponder(_transponder);
                setNumberPackager(_numberPackage);
                setGateNumber(_gateNumber);
                setStartNumber(_startNumber);
                timeout = setTimeout(() => {
                    setTransponder(undefined);
                    setNumberPackager(undefined);
                    setGateNumber(undefined);
                    setStartNumber(undefined);
                }, 10000);
            }
        );
        return () => {
            if (timeout) {
                clearInterval(timeout);
            }
        };
    }, []);

    if (!transponder) return null;
    return (
        <div>
            <Paper className={styles.transponderCheck}>
                <div className={styles.transponderData}>
                    {`№: ${transponder}`}
                    <IconButton onClick={handleCopy(transponder)}>
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                </div>
                {sportsman && <div className={styles.sportsman}>{sportsmanName(sportsman, true)}</div>}
                <div className={styles.gateData}>{`Gate: ${gateNumber}`}</div>
                <div className={styles.packData}>
                    {numberPackage && <div>{`Pack: ${numberPackage}`}</div>}
                    {startNumber && <div>{`Start: ${startNumber}`}</div>}
                </div>
            </Paper>
        </div>
    );
});
