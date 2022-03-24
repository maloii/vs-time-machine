import { IPilotRcPilots } from '@/types/IRcPilotsResponse';
import { ISportsman } from '@/types/ISportsman';

export const rcPilotsTransform = (pilot: IPilotRcPilots): Omit<ISportsman, '_id' | 'photo' | 'competitionId'> => ({
    transponders: [],
    firstName: pilot.fname,
    lastName: pilot.lname,
    middleName: '',
    nick: pilot.osd_name,
    city: '',
    team: pilot.team_name,
    phone: '',
    email: '',
    country: '',
    selected: true,
    externalId: pilot.id
});

export const rcPilotsUpdate = (
    pilot: IPilotRcPilots,
    sportsman: ISportsman
): Omit<ISportsman, '_id' | 'photo' | 'competitionId'> => ({
    ...sportsman,
    firstName: pilot.fname,
    lastName: pilot.lname,
    nick: pilot.osd_name,
    team: pilot.team_name
});
