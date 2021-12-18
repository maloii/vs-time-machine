import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as Logo } from '../../../../media/logo.svg';
import { ReactComponent as Users } from '../../../../media/users.svg';

import styles from './styles.module.scss';

export const Aside = () => {
  return (
    <aside>
      <div className={styles.logo}>
        <Logo />
      </div>
      <Link to="/sportsmen" className={styles.itemMenu}>
        <Users />
        <span>Sportsmen</span>
      </Link>
    </aside>
  );
};
