import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { autorun } from 'mobx';
import _ from 'lodash';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { StopWatch } from '@/modules/rounds/components/StopWatch/StopWatch';
import { TableLaps } from '@/modules/rounds/components/TableLaps/TableLaps';
import { TakeOffArea } from '@/modules/broadcast/components/TakeOffArea/TakeOffArea';
import { CaptureDVRScreen } from '@/modules/broadcast/components/CaptureDVRScreen/CaptureDVRScreen';
import { story } from '@/story/story';
import { IBroadCast } from '@/types/IBroadCast';
import { TypeBroadCastComponents } from '@/types/TypeBroadCastComponents';
import { ContentReport } from '@/modules/reports/components/ContentReport/ContentReport';
import { TypeChromaKey } from '@/types/TypeChromaKey';

import styles from './styles.module.scss';

export const ScreenBroadCastContainer: FC = observer(() => {
    const [broadCast, setBroadCast] = useState<IBroadCast>();

    const params = useParams<{ screenId: string }>();

    const style = useMemo(() => {
        if (broadCast?.chromaKey !== TypeChromaKey.NONE) {
            return { background: broadCast?.chromaKey };
        }
        if (broadCast?.background) {
            return { backgroundImage: `url('${window.api.getFilePath(broadCast?.background)}')` };
        }
    }, [broadCast?.background, broadCast?.chromaKey]);

    useEffect(() => {
        console.log('----');
        autorun(() => {
            if (params.screenId) {
                setBroadCast(story.broadCasts.find((broadCast) => broadCast._id === params.screenId));
            }
        });
    }, [params.screenId]);

    const screenComponent = (idComponent?: string): ReactNode | null => {
        if (idComponent === TypeBroadCastComponents.STOP_WATCH.toString()) {
            return (
                <StopWatch round={story.groupInRace?.round} raceStatus={story.raceStatus} startTime={story.startTime} />
            );
        } else if (idComponent === TypeBroadCastComponents.CURRENT_GROUP.toString()) {
            if (story.groupInRace && story.groupInRace.round) {
                const selectedGroup = (story.groups || []).find((group) => group.selected);
                return (
                    <>
                        <h2
                            className={styles.header}
                        >{`${story.groupInRace.round.name} - ${story.groupInRace.name}`}</h2>
                        <TableLaps
                            round={story.groupInRace.round}
                            group={selectedGroup || story.groupInRace}
                            groupLaps={story.laps}
                            raceStatus={story.raceStatus}
                            readonly
                            scrollable={false}
                        />
                    </>
                );
            }
        } else if (idComponent === TypeBroadCastComponents.TAKE_OFF_AREA.toString()) {
            if (story.groupInRace && story.groupInRace.round) {
                return (
                    <TakeOffArea
                        round={story.groupInRace.round}
                        group={story.groupInRace}
                        raceStatus={story.raceStatus}
                    />
                );
            }
        } else if (idComponent === TypeBroadCastComponents.CAPTURE_DVR.toString()) {
            return <CaptureDVRScreen />;
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
    };

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
