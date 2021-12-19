import { DateTime } from 'luxon';

export interface ITeam {
    _id: string;
    dateCreate: DateTime;
    photo: string;
    city: string;
    country: string;
    position: number;
    sportsmenIds: string[];
}
