import { DateTime } from 'luxon';
import { TypeGroup } from './TypeGroup';

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

    sportsmenIds: string[];
    teamsIds: string[];
}
