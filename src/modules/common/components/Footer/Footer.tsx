import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import styles from './styles.module.scss';
import { story } from '@/story/story';

export const Footer: FC = observer(() => {
    const [message, setMessage] = useState<string>();
    useEffect(() => {
        window.api.ipcRenderer.removeAllListeners('connector-message');
        window.api.ipcRenderer.on('connector-message', (e: any, res: string) => {
            setMessage(res);
        });
    }, []);
    return <div className={styles.footer}>{story.connected ? message : 'Disconnected'}</div>;
});
