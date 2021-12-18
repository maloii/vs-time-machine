import React, { FC } from 'react';
import { Button } from '@mui/material';
import { observer } from 'mobx-react';
import styles from './styles.module.scss';
// const { path } = window.require('electron');

export const CompetitionController: FC = observer(() => {
  const handleOpenConsole = () => {
    // window.open(
    //   !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    //     ? 'http://localhost:3000/serial-port'
    //     : `file://${path.join(__dirname, '../build/index.html#serial-port')}`,
    //   '_blank',
    //   ''
    // );
  };

  return (
    <div className={styles.root}>
      Competition
      <Button variant="outlined" onClick={handleOpenConsole}>
        Open console
      </Button>
    </div>
  );
});
