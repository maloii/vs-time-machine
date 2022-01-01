import { DateTime } from 'luxon';
import { TypeGroup } from './TypeGroup';
import { Channel } from '@/types/VTXChannel';
import { Color } from '@/types/Color';
import {ITeam} from "@/types/ITeam";
import {ISportsman} from "@/types/ISportsman";

export interface IMembersGroup {
    _id: string;
    position: number;
    color?: Color;
    channel?: Channel;
    sportsman?: ISportsman;
    team?: ITeam;
}
export interface IGroup {
    _id: string;
    roundId: string;
    name: string;
    sort: number;
    selected: boolean;
    close: boolean;
    timeStart?: DateTime;
    startMillisecond?: number;
    typeGroup: TypeGroup;
    sportsmen: IMembersGroup[];
    teams: IMembersGroup[];
}
