import { TypeLap } from './TypeLap';
import { IGate } from '@/types/IGate';

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
    gate?: IGate;
}
