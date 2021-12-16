import React from 'react';
import { ReactComponent as Logo } from '../../../media/logo.svg';

import styles from './styles.module.scss';

export const Aside = () => {
  return (
    <aside>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.competition}></div>
    </aside>
  );
};
