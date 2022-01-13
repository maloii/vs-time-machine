import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SportsmenController } from '@/modules/sportsmen/controllers/SportsmenController';
import { RoundsController } from '@/modules/rounds/controllers/RoundsController';
import { ReportsController } from '@/modules/reports/controllers/ReportsController';
import { BroadCastController } from '@/modules/broadcast/controllers/BroadCastController';
import { CurrentGroupScreenBroadCastController } from '@/modules/broadcast/controllers/CurrentGroupScreenBroadCastController';
import { MainLayout } from '@/modules/common/components/MainLayout/MainLayout';

export const Router: FC = observer(() => {
    const routers = (
        <Routes>
            <Route path="/screen/current-group" element={<CurrentGroupScreenBroadCastController />} />
            <Route
                element={
                    <MainLayout>
                        <Outlet />
                    </MainLayout>
                }
            >
                <Route path="/main/rounds" element={<RoundsController />} />
                <Route path="/main/sportsmen" element={<SportsmenController />} />
                <Route path="/main/reports" element={<ReportsController />} />
                <Route path="/main/broadcasts" element={<BroadCastController />} />
                <Route path="*" element={<Navigate replace to="/main/sportsmen" />} />
            </Route>
        </Routes>
    );
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? (
        <BrowserRouter>{routers}</BrowserRouter>
    ) : (
        <HashRouter>{routers}</HashRouter>
    );
});
