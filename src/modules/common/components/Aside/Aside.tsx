import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import { ReactComponent as Logo } from '../../../../media/logo.svg';
import { ReactComponent as Users } from '../../../../media/users.svg';
import { ReactComponent as Stopwatch } from '../../../../media/stopwatch.svg';

import styles from './styles.module.scss';

export const Aside = () => {
    return (
        <aside>
            <div className={styles.logo}>
                <Logo />
            </div>
            <Link to="/sportsmen" className={cn(styles.itemMenu, styles.iconStroke)}>
                <Users />
                <span>Sportsmen</span>
            </Link>
            <Link to="/rounds" className={cn(styles.itemMenu, styles.iconFill)}>
                <Stopwatch />
                <span>Race</span>
            </Link>
        </aside>
    );
};
