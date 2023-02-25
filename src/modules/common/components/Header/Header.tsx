import React from 'react';
import { observer } from 'mobx-react';
import { SelectCompetition } from './SelectCompetition';
import { Connect } from './Connect';
import { CaptureVtx } from './CaptureVTX';

import styles from './styles.module.scss';

export const Header = observer(() => {
    return (
        <div className={styles.header}>
            <SelectCompetition />
            <CaptureVtx />
            <Connect />
        </div>
    );
});
