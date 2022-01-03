import React, { useCallback, useState, FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Button, FormControl, MenuItem, TextField } from '@mui/material';

import styles from './styles.module.scss';
import { useInterval } from '@/hooks/useInterval';

export const SelectSerialPort: FC = observer(() => {
    const [portPath, setPortPath] = useState<string>('');
    const [listPorts, setListPorts] = useState<Array<string>>([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleChangePort = useCallback((event) => {
        setPortPath(event.target.value);
    }, []);

    const handleOpen = useCallback(() => {
        if (portPath) {
            window.api.ipcRenderer.send('connect-serial-port-request', portPath);
        }
    }, [portPath]);

    const handleClose = useCallback(() => {
        if (window.confirm('Are you sure you want to disconnect the connection serial port?')) {
            window.api.ipcRenderer.send('disconnect-serial-ports-request');
        }
    }, []);

    useInterval(() => {
        window.api.ipcRenderer.send('list-serial-ports-request');
        window.api.ipcRenderer.send('status-serial-port-request');
    }, 1000);

    useEffect(() => {
        window.api.ipcRenderer.on('list-serial-ports-response', (e: any, list: string[]) => {
            setListPorts(list);
        });
        window.api.ipcRenderer.on('status-serial-port', (e: any, res: { isOpen: boolean; path?: string }) => {
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
