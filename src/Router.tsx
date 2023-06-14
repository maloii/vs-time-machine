import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SportsmenContainer } from '@/modules/sportsmen/containers/SportsmenContainer';
import { RoundsContainer } from '@/modules/rounds/containers/RoundsContainer';
import { ReportsContainer } from '@/modules/reports/containers/ReportsContainer';
import { BroadCastContainer } from '@/modules/broadcast/containers/BroadCastContainer';
import { ScreenBroadCastContainer } from '@/modules/broadcast/containers/ScreenBroadCastContainer';
import { MainLayout } from '@/modules/common/components/MainLayout/MainLayout';
import { ImportFromRcPilotsProContainer } from '@/modules/import/containers/ImportFromRcPilotsProContainer';
import { SettingsContainer } from '@/modules/settings/containers/SettingsContainer';

export const Router: FC = observer(() => {
    const routers = (
        <Routes>
            <Route path="/screen/:screenId" element={<ScreenBroadCastContainer />} />
            <Route path="/import/rcpilots" element={<ImportFromRcPilotsProContainer />} />
            <Route path="/settings" element={<SettingsContainer />} />

            <Route
                element={
                    <MainLayout>
                        <Outlet />
                    </MainLayout>
                }
            >
                <Route path="/main/rounds" element={<RoundsContainer />} />
                <Route path="/main/sportsmen" element={<SportsmenContainer />} />
                <Route path="/main/reports" element={<ReportsContainer />} />
                <Route path="/main/broadcasts" element={<BroadCastContainer />} />
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
