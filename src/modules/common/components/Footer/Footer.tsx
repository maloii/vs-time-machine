import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import styles from './styles.module.scss';

const { ipcRenderer } = window.require('electron');

export const Footer: FC = observer(() => {
    const [message, setMessage] = useState<string>();
    useEffect(() => {
        ipcRenderer.on('connector-message', (e, res: string) => {
            setMessage(res);
        });
        ipcRenderer.on('status-serial-port', (e, res: { isOpen: boolean; path?: string }) => {
            if (!res.isOpen) {
                setMessage('Disconnected');
            }
        });
    }, []);
    return <div className={styles.footer}>{message}</div>;
});
