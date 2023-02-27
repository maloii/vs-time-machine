import { IGate } from './IGate';
import { Color } from '@/types/Color';
import { Channel } from '@/types/VTXChannel';

export interface ICompetition {
    _id: string;
    name: string;
    logo: string;
    selected: boolean;
    skipFirstGate?: boolean;
    playFail?: boolean;
    gates: IGate[];

    color1: Color;
    color2: Color;
    color3: Color;
    color4: Color;
    color5: Color;
    color6: Color;
    color7: Color;
    color8: Color;

    channel1: Channel;
    channel2: Channel;
    channel3: Channel;
    channel4: Channel;
    channel5: Channel;
    channel6: Channel;
    channel7: Channel;
    channel8: Channel;

    execCommandsEnabled: boolean;
    execReadyCommand: string;
    execStartCommand: string;
    execFinishCommand: string;

    captureVTXEnabled: boolean;
    captureDeviceId?: string;
}
