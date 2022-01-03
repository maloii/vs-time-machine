import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import styles from './styles.module.scss';

export const Footer: FC = observer(() => {
    const [message, setMessage] = useState<string>();
    useEffect(() => {
        window.api.ipcRenderer.removeAllListeners('connector-message');
        window.api.ipcRenderer.removeAllListeners('status-serial-port');
        window.api.ipcRenderer.on('connector-message', (e: any, res: string) => {
            setMessage(res);
        });
        window.api.ipcRenderer.on('status-serial-port', (e: any, res: { isOpen: boolean; path?: string }) => {
            if (!res.isOpen) {
                setMessage('Disconnected');
            }
        });
    }, []);
    return <div className={styles.footer}>{message}</div>;
});
