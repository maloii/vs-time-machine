import React, { useCallback, useState, FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Button, FormControl, MenuItem, TextField } from '@mui/material';
import { useInterval } from '@/hooks/useInterval';
import { story } from '@/story/story';

import styles from './styles.module.scss';

export const Connect: FC = observer(() => {
    const [portPath, setPortPath] = useState<string>('');
    const [listPorts, setListPorts] = useState<Array<string>>([]);

    const handleChangePort = useCallback((event) => {
        setPortPath(event.target.value);
    }, []);

    const handleOpen = useCallback(() => {
        if (portPath) {
            window.api.ipcRenderer.send('connect-serial-port-request', portPath);
        }
    }, [portPath]);

    const handleOpenWlan = useCallback(() => {
        window.api.ipcRenderer.send('connect-wlan-request', '192.168.197.255', 8889, 8888);
    }, []);

    const handleClose = useCallback(() => {
        if (window.confirm('Are you sure you want to disconnect?')) {
            window.api.ipcRenderer.send('disconnect-serial-ports-request');
            window.api.ipcRenderer.send('disconnect-wlan-request');
        }
    }, []);

    useInterval(() => {
        window.api.ipcRenderer.send('list-serial-ports-request');
        window.api.ipcRenderer.send('status-connect-request');
    }, 1000);

    useEffect(() => {
        window.api.ipcRenderer.on('list-serial-ports-response', (e: any, list: string[]) => {
            setListPorts(list);
        });
    }, []);

    console.log(story.serialPortStatus?.isOpen, story.wlanStatus?.isOpen);
    return (
        <div className={styles.selectSerialPort}>
            {story.wlanStatus?.isOpen ? (
                <Button size="small" variant="outlined" onClick={handleClose}>
                    WLAN Disconnect
                </Button>
            ) : (
                <Button
                    size="small"
                    variant="outlined"
                    disabled={story.serialPortStatus?.isOpen}
                    onClick={handleOpenWlan}
                >
                    WLAN Connect
                </Button>
            )}
            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                <TextField
                    select
                    value={story.serialPortStatus?.isOpen ? story.serialPortStatus?.path : portPath}
                    onChange={handleChangePort}
                    label="Serial port"
                    size="small"
                    disabled={story.serialPortStatus?.isOpen || story.wlanStatus?.isOpen}
                >
                    {listPorts.map((port) => (
                        <MenuItem key={port} value={port}>
                            {port}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
            {story.serialPortStatus?.isOpen ? (
                <Button size="small" variant="outlined" onClick={handleClose}>
                    Disconnect
                </Button>
            ) : (
                <Button
                    size="small"
                    variant="outlined"
                    disabled={!portPath || story.wlanStatus?.isOpen}
                    onClick={handleOpen}
                >
                    Connect
                </Button>
            )}
        </div>
    );
});
