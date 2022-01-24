import React, { FC } from 'react';
import { Avatar } from '@mui/material';
import { ColorAndChannel } from '@/modules/rounds/components/ColorAndChannel/ColorAndChannel';
import { IRound } from '@/types/IRound';
import { IGroup } from '@/types/IGroup';
import { TypeRaceStatus } from '@/types/TypeRaceStatus';
import { sportsmanName } from '@/utils/sportsmanName';
import { ColorCss } from '@/types/Color';
import { ReactComponent as TakeOffImg } from '../../../../media/take-off.svg';

import styles from './styles.module.scss';

interface IProps {
    round: IRound;
    group: IGroup;
    raceStatus?: TypeRaceStatus;
}

export const TakeOffArea: FC<IProps> = ({ round, group, raceStatus }: IProps) => {
    const memberGroup = [...group.sportsmen, ...group.teams];
    return (
        <div className={styles.root}>
            <h1 className={styles.nameGroup}>{`${round.name} - ${group.name}`}</h1>
            <div className={styles.groups}>
                {memberGroup.map((item) => (
                    <div key={`take-off-${item._id}`} className={styles.takeOff}>
                        <h1 className={styles.nameSportsman}>
                            {item.team?.name ||
                                item.sportsman?.nick ||
                                (item.sportsman ? sportsmanName(item.sportsman, true) : '')}
                        </h1>
                        <Avatar
                            alt="Photo"
                            className={styles.photo}
                            src={
                                (item.sportsman || item.team)?.photo
                                    ? window.api.getFilePath((item.sportsman || item.team)?.photo)
                                    : undefined
                            }
                        />
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
                ))}
            </div>
        </div>
    );
};
