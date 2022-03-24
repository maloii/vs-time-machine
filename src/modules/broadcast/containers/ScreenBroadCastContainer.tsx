import React, { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { StopWatch } from '@/modules/rounds/components/StopWatch/StopWatch';
import { TableLaps } from '@/modules/rounds/components/TableLaps/TableLaps';
import { TakeOffArea } from '@/modules/broadcast/components/TakeOffArea/TakeOffArea';
import { story } from '@/story/story';
import { getGroupInRaceAction, getRaceStatusAction, getStartTimeAction } from '@/actions/actionRaceRequest';
import { handleLoadBroadCastByIdAction } from '@/actions/actionBroadcastRequest';
import { loadGroupByIdAction } from '@/actions/actionGroupRequest';
import { IGroup } from '@/types/IGroup';
import { IBroadCast } from '@/types/IBroadCast';
import { TypeBroadCastComponents } from '@/types/TypeBroadCastComponents';
import { ContentReport } from '@/modules/reports/components/ContentReport/ContentReport';
import { loadReportsAction } from '@/actions/actionReportRequest';
import { loadCompetitionsAction } from '@/actions/actionCompetitionRequest';
import { TypeChromaKey } from '@/types/TypeChromaKey';

import styles from './styles.module.scss';

export const ScreenBroadCastContainer: FC = observer(() => {
    const [broadCast, setBroadCast] = useState<IBroadCast>();

    const [startTime, setStartTime] = useState(story.startTime);
    const [raceStatus, setRaceStatus] = useState(story.raceStatus);
    const [groupInRace, setGroupInRace] = useState(story.groupInRace);
    const [group, setGroup] = useState<IGroup | undefined>();
    const [roundInRace, setRoundInRace] = useState(story.groupInRace?.round);

    const params = useParams<{ screenId: string }>();

    const screenComponent = useCallback(
        (idComponent?: string): ReactNode | null => {
            if (idComponent === TypeBroadCastComponents.STOP_WATCH.toString()) {
                return <StopWatch round={groupInRace?.round} raceStatus={raceStatus} startTime={startTime} />;
            } else if (idComponent === TypeBroadCastComponents.CURRENT_GROUP.toString()) {
                if (roundInRace && groupInRace && group) {
                    return (
                        <>
                            <h2 className={styles.header}>{`${roundInRace.name} - ${groupInRace.name}`}</h2>
                            <TableLaps round={roundInRace} group={group} readonly />
                        </>
                    );
                }
            } else if (idComponent === TypeBroadCastComponents.TAKE_OFF_AREA.toString()) {
                if (roundInRace && group) {
                    return <TakeOffArea round={roundInRace} group={group} raceStatus={raceStatus} />;
                }
            } else if (idComponent) {
                const report = _.find(story.reports, ['_id', idComponent]);
                if (report)
                    return (
                        <>
                            {broadCast?.showTitleReport && <h2 className={styles.header}>{report.name}</h2>}
                            <ContentReport
                                report={report}
                                isBroadcast
                                className={cn({ [styles.broadcastReportStyle]: report.broadCastStyle })}
                            />
                        </>
                    );
            }
            return null;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            broadCast?.showTitleReport,
            group,
            groupInRace,
            raceStatus,
            roundInRace,
            startTime,
            story.reports,
            story.rounds,
            story.sportsmen,
            story.teams,
            story.laps
        ]
    );

    const style = useMemo(() => {
        if (broadCast?.chromaKey !== TypeChromaKey.NONE) {
            return { background: broadCast?.chromaKey };
        }
        if (broadCast?.background) {
            return { backgroundImage: `url('${window.api.getFilePath(broadCast?.background)}')` };
        }
    }, [broadCast?.background, broadCast?.chromaKey]);

    useEffect(() => {
        loadCompetitionsAction();
        Promise.all([getStartTimeAction(), getRaceStatusAction(), getGroupInRaceAction()]).then(
            async ([resStartTime, resRaceStatus, resGroupInRace]) => {
                setStartTime(resStartTime);
                setRaceStatus(resRaceStatus);
                if (resGroupInRace) {
                    setGroupInRace(resGroupInRace);
                    setGroup(await loadGroupByIdAction(resGroupInRace._id));
                }
                setRoundInRace(resGroupInRace?.round);
            }
        );
    }, []);

    useEffect(() => {
        if (story.startTime) setStartTime(story.startTime);
        if (story.raceStatus) setRaceStatus(story.raceStatus);
        if (story.groupInRace) {
            loadGroupByIdAction(story.groupInRace._id).then(setGroupInRace);
            setRoundInRace(story.groupInRace.round);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [story.startTime, story.raceStatus, story.groupInRace]);

    useEffect(() => {
        if (groupInRace) {
            window.api.ipcRenderer.removeAllListeners('group-update-response');
            window.api.ipcRenderer.on('group-update-response', async () => {
                setGroup(await loadGroupByIdAction(groupInRace._id));
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupInRace]);

    useEffect(() => {
        if (params.screenId) {
            loadCompetitionsAction();
            handleLoadBroadCastByIdAction(params.screenId).then(setBroadCast);
            window.api.ipcRenderer.removeAllListeners('group-in-race');
            window.api.ipcRenderer.removeAllListeners('report-insert-response');
            window.api.ipcRenderer.removeAllListeners('report-update-response');
            window.api.ipcRenderer.removeAllListeners('report-delete-response');
            window.api.ipcRenderer.removeAllListeners('broadcast-insert-message');
            window.api.ipcRenderer.removeAllListeners('broadcast-update-message');
            window.api.ipcRenderer.removeAllListeners('broadcast-delete-message');
            window.api.ipcRenderer.on('report-insert-response', () => loadReportsAction(story.competition?._id!));
            window.api.ipcRenderer.on('report-update-response', () => loadReportsAction(story.competition?._id!));
            window.api.ipcRenderer.on('report-delete-response', () => loadReportsAction(story.competition?._id!));
            window.api.ipcRenderer.on('broadcast-insert-message', () =>
                handleLoadBroadCastByIdAction(params.screenId!).then(setBroadCast)
            );
            window.api.ipcRenderer.on('broadcast-update-message', () =>
                handleLoadBroadCastByIdAction(params.screenId!).then(setBroadCast)
            );
            window.api.ipcRenderer.on('broadcast-delete-message', () =>
                handleLoadBroadCastByIdAction(params.screenId!).then(setBroadCast)
            );
            window.api.ipcRenderer.on('group-in-race', async (e: any, newGroup: IGroup) => {
                setRoundInRace(newGroup?.round);
                setGroupInRace(newGroup);
                setGroup(await loadGroupByIdAction(newGroup._id));
            });
        }
    }, [params.screenId]);

    return (
        <div className={styles.root} style={style}>
            {(broadCast?.showMainLogo || !!broadCast?.top) && (
                <div className={styles.top}>
                    {broadCast?.showMainLogo && (
                        <div className={styles.logo}>
                            <img
                                src={window.api.getFilePath(
                                    story.competition?.logo || window.api.DEFAULT_COMPETITION_LOGO
                                )}
                                alt="logo"
                            />
                        </div>
                    )}
                    {!!broadCast?.top && screenComponent(broadCast?.top)}
                </div>
            )}
            <div className={styles.centerBlock}>
                {(!!broadCast?.left || !!broadCast?.left2) && (
                    <div className={styles.left}>
                        {screenComponent(broadCast?.left)}
                        {screenComponent(broadCast?.left2)}
                    </div>
                )}
                {(!!broadCast?.center || !!broadCast?.center2) && (
                    <div className={styles.center}>
                        {screenComponent(broadCast?.center)}
                        {screenComponent(broadCast?.center2)}
                    </div>
                )}
                {(!!broadCast?.right || !!broadCast?.right2) && (
                    <div className={styles.right}>
                        {screenComponent(broadCast?.right)}
                        {screenComponent(broadCast?.right2)}
                    </div>
                )}
            </div>
            {!!broadCast?.bottom && <div className={styles.bottom}>{screenComponent(broadCast?.bottom)}</div>}
        </div>
    );
});
