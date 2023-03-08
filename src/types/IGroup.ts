import { TypeGroup } from './TypeGroup';
import { Channel } from '@/types/VTXChannel';
import { Color } from '@/types/Color';
import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';
import { ICompetition } from '@/types/ICompetition';
import { IRound } from '@/types/IRound';
import { ILap } from '@/types/ILap';

export interface IMembersGroup {
    _id: string;
    startNumber: number;
    position?: number;
    color?: Color;
    channel?: Channel;
    sportsman?: ISportsman;
    team?: ITeam;
    searchTransponder?: boolean;
    searchTeamSportsmenIds?: string[];
    totalTime?: number;
    finished?: boolean;
}
export interface IGroup {
    _id: string;
    roundId: string;
    competitionId: string;
    name: string;
    sort: number;
    selected: boolean;
    close: boolean;
    timeStart?: number;
    timeReady?: number;
    timeStop?: number;
    typeGroup: TypeGroup;
    sportsmen: IMembersGroup[];
    teams: IMembersGroup[];
    competition?: ICompetition;
    round?: IRound;
    laps?: ILap[];
    videoSrc?: string;
}
