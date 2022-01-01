import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { Color, ColorCss } from '@/types/Color';
import { Channel, ChannelFrequencies } from '@/types/VTXChannel';

import styles from './styles.module.scss';

interface IProps {
    color: Color;
    channel: Channel;
}

export const ColorAndChannel: FC<IProps> = ({ color, channel }: IProps) => {
    const colorText = (): string => {
        switch (color) {
            case Color.BLACK:
            case Color.BLUE:
                return 'white';
        }
        return 'black';
    };
    return (
        <Tooltip title={`${ChannelFrequencies[channel]} MHz`} arrow>
            <div
                style={{
                    background: ColorCss[color],
                    color: colorText(),
                    border: `${color === Color.WHITE ? 1 : 0}px solid black`
                }}
                className={styles.roundColorAndChannel}
            >
                {channel}
            </div>
        </Tooltip>
    );
};
