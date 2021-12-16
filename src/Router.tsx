import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { SerialPortController } from './serial-port/controllers/SerialPortController';
import { CompetitionController } from './modules/competition/controllers/CompetitionController';
import { MainLayout } from './common/components/MainLayout/MainLayout';

export const Router: FC = observer(() => {
  return (
    <MainLayout>
      {!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CompetitionController />} />
            <Route path="/serial-port" element={<SerialPortController />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <HashRouter>
          <Routes>
            <Route path="/" element={<CompetitionController />} />
            <Route path="/serial-port" element={<SerialPortController />} />
          </Routes>
        </HashRouter>
      )}
    </MainLayout>
  );
});
