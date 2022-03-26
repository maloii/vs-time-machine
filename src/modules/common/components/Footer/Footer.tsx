import React, { FC } from 'react';
import { observer } from 'mobx-react';

import styles from './styles.module.scss';
import { story } from '@/story/story';

export const Footer: FC = observer(() => {
    return <div className={styles.footer}>{story.connected ? story.connectorMessage : 'Disconnected'}</div>;
});
