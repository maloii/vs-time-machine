import { DateTime } from 'luxon';

export interface IGate {
    _id: string;
    dateCreate: DateTime;
    number: number;
    finish: boolean;
    position: number;
    distance: number;
    delay: number;
    speed: boolean;
}
