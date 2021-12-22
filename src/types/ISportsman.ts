import { DateTime } from 'luxon';

export interface ISportsman {
    _id: string;
    competitionId: string;
    dateCreate: DateTime;
    firstName: string;
    lastName: string;
    middleName: string;
    nick: string;
    photo: string;
    city: string;
    age?: number;
    team: string;
    phone: string;
    email: string;
    country: string;
    position?: number;
    selected: boolean;
}
