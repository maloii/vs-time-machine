import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import { ReactComponent as Logo } from '../../../../media/logo.svg';
import { ReactComponent as Users } from '../../../../media/users.svg';
import { ReactComponent as Stopwatch } from '../../../../media/stopwatch.svg';
import { ReactComponent as Report } from '../../../../media/report.svg';
import { ReactComponent as Broadcast } from '../../../../media/broadcast.svg';

import styles from './styles.module.scss';

export const Aside = () => {
    return (
        <aside>
            <div className={styles.logo}>
                <Logo />
            </div>
            <Link to="/main/sportsmen" className={cn(styles.itemMenu, styles.iconStroke)}>
                <Users />
                <span>Sportsmen</span>
            </Link>
            <Link to="/main/rounds" className={cn(styles.itemMenu, styles.iconFill)}>
                <Stopwatch />
                <span>Race</span>
            </Link>
            <Link to="/main/reports" className={cn(styles.itemMenu, styles.iconFillWithoutPath)}>
                <Report />
                <span>Reports</span>
            </Link>
            <Link to="/main/broadcasts" className={cn(styles.itemMenu, styles.iconFill)}>
                <Broadcast />
                <span>Broadcast</span>
            </Link>
        </aside>
    );
};
