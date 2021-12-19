import { DateTime } from 'luxon';
import { TypeLap } from './TypeLap';

export interface ILap {
    _id: string;
    dateCreate: DateTime;
    millisecond: number;
    timeLap: number;
    typeLap: TypeLap;
    competitionId: string;
    roundId: string;
    groupId: string;
    gateId: string;
}
