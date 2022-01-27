import React, { FC, useEffect, useRef, useState } from 'react';
import { ColorAndChannel } from '@/modules/rounds/components/ColorAndChannel/ColorAndChannel';
import { IRound } from '@/types/IRound';
import { IGroup } from '@/types/IGroup';
import { TypeRaceStatus } from '@/types/TypeRaceStatus';
import { sportsmanName } from '@/utils/sportsmanName';
import { ColorCss } from '@/types/Color';
import { ReactComponent as TakeOffImg } from '../../../../media/take-off.svg';

import styles from './styles.module.scss';

const nameCountdown: Record<string, string> = {
    [TypeRaceStatus.READY]: 'READY',
    [TypeRaceStatus.COUNTDOWN_3]: '3',
    [TypeRaceStatus.COUNTDOWN_2]: '2',
    [TypeRaceStatus.COUNTDOWN_1]: '1',
    [TypeRaceStatus.RUN]: 'START'
};

interface IProps {
    round: IRound;
    group: IGroup;
    raceStatus?: TypeRaceStatus;
}

export const TakeOffArea: FC<IProps> = ({ round, group, raceStatus }: IProps) => {
    const [countdown, setCountdown] = useState<string | undefined>(undefined);
    const refTimer = useRef<NodeJS.Timeout>();

    const memberGroup = [...group.sportsmen, ...group.teams];

    useEffect(() => {
        setCountdown(raceStatus ? nameCountdown?.[raceStatus] : undefined);
        refTimer.current = setTimeout(() => {
            setCountdown(undefined);
        }, 8000);
        return () => {
            if (refTimer.current) {
                clearInterval(refTimer.current);
            }
        };
    }, [raceStatus]);

    return (
        <div className={styles.root}>
            <h1 className={styles.nameGroup}>{`${round.name} - ${group.name}`}</h1>
            <div className={styles.groups}>
                {memberGroup.map((item) => {
                    const name =
                        item.team?.name ||
                        item.sportsman?.nick ||
                        (item.sportsman ? sportsmanName(item.sportsman, true) : '');
                    return (
                        <div key={`take-off-${item._id}`} className={styles.takeOff}>
                            <h1 className={styles.nameSportsman}>{name}</h1>
                            <div className={styles.photo}>
                                <img
                                    alt={name}
                                    src={window.api.getFilePath(
                                        (item.sportsman || item.team)?.photo || window.api.DEFAULT_PHOTO
                                    )}
                                />
                            </div>
                            {item.channel !== undefined && item.color !== undefined && (
                                <ColorAndChannel
                                    className={styles.colorAndChannel}
                                    channel={item.channel}
                                    color={item.color}
                                />
                            )}
                            <div
                                className={styles.takeOffAria}
                                style={{
                                    background: item?.searchTransponder && item.color ? ColorCss[item.color] : 'none'
                                }}
                            >
                                <TakeOffImg />
                            </div>
                        </div>
                    );
                })}
            </div>
            {countdown && <div className={styles.countdown}>{countdown}</div>}
        </div>
    );
};
