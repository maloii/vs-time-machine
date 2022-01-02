import React, { useCallback, useState, FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Button, FormControl, MenuItem, TextField } from '@mui/material';

import styles from './styles.module.scss';
import { useInterval } from '@/hooks/useInterval';

const { ipcRenderer } = window.require('electron');

export const SelectSerialPort: FC = observer(() => {
    const [portPath, setPortPath] = useState<string>('');
    const [listPorts, setListPorts] = useState<Array<string>>([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleChangePort = useCallback((event) => {
        setPortPath(event.target.value);
    }, []);

    const handleOpen = useCallback(() => {
        if (portPath) {
            ipcRenderer.send('connect-serial-port-request', portPath);
        }
    }, [portPath]);

    const handleClose = useCallback(() => {
        if (window.confirm('Are you sure you want to disconnect the connection serial port?')) {
            ipcRenderer.send('disconnect-serial-ports-request');
        }
    }, []);

    useInterval(() => {
        ipcRenderer.send('list-serial-ports-request');
        ipcRenderer.send('status-serial-port-request');
    }, 1000);

    useEffect(() => {
        ipcRenderer.on('list-serial-ports-response', (e, list: string[]) => {
            setListPorts(list);
        });
        ipcRenderer.on('status-serial-port', (e, res: { isOpen: boolean; path?: string }) => {
            setIsOpen(res.isOpen);
            if (res.isOpen) {
                setPortPath(res.path || '');
            }
        });
    }, []);

    return (
        <div className={styles.selectSerialPort}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                <TextField
                    select
                    value={portPath}
                    onChange={handleChangePort}
                    label="Serial port"
                    size="small"
                    disabled={isOpen}
                >
                    {listPorts.map((port) => (
                        <MenuItem key={port} value={port}>
                            {port}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
            {isOpen ? (
                <Button size="small" variant="outlined" onClick={handleClose}>
                    Disconnect
                </Button>
            ) : (
                <Button size="small" variant="outlined" disabled={!portPath} onClick={handleOpen}>
                    Connect
                </Button>
            )}
        </div>
    );
});
