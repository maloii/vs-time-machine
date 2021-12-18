import React from 'react';
import { observer } from 'mobx-react';
import { SelectCompetition } from './SelectCompetition';
import { SelectSerialPort } from './SelectSerialPort';

import styles from './styles.module.scss';

export const Header = observer(() => {
  return (
    <div className={styles.header}>
      <SelectCompetition />
      <SelectSerialPort />
    </div>
  );
});
