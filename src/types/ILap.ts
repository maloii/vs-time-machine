import { TypeLap } from './TypeLap';

export interface ILap {
    _id: string;
    millisecond: number;
    timeLap: number;
    typeLap: TypeLap;
    competitionId: string;
    roundId: string;
    groupId: string;
    gateId: string;
    memberGroupId: string;
    sportsmanId: string;
    transponder: string;
    position?: number;
}
