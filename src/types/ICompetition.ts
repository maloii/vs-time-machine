import { IGate } from './IGate';

export interface ICompetition {
    _id: string;
    name: string;
    logo?: string;
    selected: boolean;
    skipFirstGate?: boolean;
    gates: IGate[];
}
