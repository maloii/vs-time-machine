import { Color } from '@/types/Color';
import { Channel } from '@/types/VTXChannel';
import { ICompetition } from '@/types/ICompetition';

export const competitionColorAndChannel = (
    position: number,
    competition: ICompetition
): { color: Color; channel: Channel } | undefined => {
    switch (position) {
        case 1:
            return {
                color: competition.color1,
                channel: competition.channel1
            };
        case 2:
            return {
                color: competition.color2,
                channel: competition.channel2
            };
        case 3:
            return {
                color: competition.color3,
                channel: competition.channel3
            };
        case 4:
            return {
                color: competition.color4,
                channel: competition.channel4
            };
        case 5:
            return {
                color: competition.color5,
                channel: competition.channel5
            };
        case 6:
            return {
                color: competition.color6,
                channel: competition.channel6
            };
        case 7:
            return {
                color: competition.color7,
                channel: competition.channel7
            };
        case 8:
            return {
                color: competition.color8,
                channel: competition.channel8
            };
    }
};
