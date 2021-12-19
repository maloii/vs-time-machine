import React, { FC } from 'react';
import { observer } from 'mobx-react';
import serialPortService from '../../services/SerialPortService';

export const SerialPortController: FC = observer(() => {
    return (
        <div>
            Serial port logs
            <pre>{serialPortService.logs.join('')}</pre>
        </div>
    );
});
