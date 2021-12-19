import React, { useCallback, useState, FC } from 'react';
import { observer } from 'mobx-react';
import { Button, FormControl, MenuItem, TextField } from '@mui/material';
import serialPortService from '../../../../services/SerialPortService';

import styles from './styles.module.scss';

export const SelectSerialPort: FC = observer(() => {
    const [portPath, setPortPath] = useState<string>();

    const handleChangePort = useCallback((event) => {
        setPortPath(event.target.value);
    }, []);

    const handleOpen = useCallback(() => {
        if (portPath) {
            serialPortService.open(portPath);
        }
    }, [portPath]);

    const handleClose = useCallback(() => {
        serialPortService.close();
    }, []);

    return (
        <div className={styles.selectSerialPort}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                <TextField select value={portPath} onChange={handleChangePort} label="Serial port" size="small">
                    {serialPortService.listPorts.map((port) => (
                        <MenuItem key={port.path} value={port.path}>
                            {port.path}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
            {serialPortService.isOpen ? (
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
