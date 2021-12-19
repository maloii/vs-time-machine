import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './modules/common/components/MainLayout/MainLayout';
import { SerialPortController } from './serial-port/controllers/SerialPortController';
import { SportsmenController } from '@/modules/sportsmen/controllers/SportsmenController';
import { RoundsController } from '@/modules/rounds/controllers/RoundsController';

export const Router: FC = observer(() => {
    const routers = (
        <MainLayout>
            <Routes>
                <Route path="/serial-port" element={<SerialPortController />} />
                <Route path="/rounds" element={<RoundsController />} />
                <Route path="/sportsmen" element={<SportsmenController />} />
                <Route path="*" element={<Navigate replace to="/sportsmen" />} />
            </Routes>
        </MainLayout>
    );
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? (
        <BrowserRouter>{routers}</BrowserRouter>
    ) : (
        <HashRouter>{routers}</HashRouter>
    );
});
