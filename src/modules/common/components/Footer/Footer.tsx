import React, { FC } from 'react';
import { observer } from 'mobx-react';
import serialPortService from '../../../../services/SerialPortService';

import styles from './styles.module.scss';

export const Footer: FC = observer(() => {
    return <div className={styles.footer}>{serialPortService.lastLog}</div>;
});
