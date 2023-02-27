import React from 'react';
import { observer } from 'mobx-react';
import { SelectCompetition } from './SelectCompetition';
import { Connect } from './Connect';
import { CaptureVtx } from './CaptureVTX';
import { story } from '@/story/story';

import styles from './styles.module.scss';

export const Header = observer(() => {
    return (
        <div className={styles.header}>
            <SelectCompetition />
            {story.competition?.captureVTXEnabled && <CaptureVtx />}
            <Connect />
        </div>
    );
});
