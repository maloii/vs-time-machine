export interface IPilotRcPilots {
    id: string;
    chat_id: string;
    pilot_id: string;
    event_unic: string;
    registred: string;
    src: string;
    add_date: string;
    fname: string;
    lname: string;
    osd_name: string;
    photo_file: string;
    karma: string;
    team_name: string;
}

export interface ICompetitionRcPilots {
    id: string;
    name: string;
    description: string;
    min_rate: string;
    max_rate: string;
    date_event: string;
    time_reg: string;
    event_create: string;
    creator: string;
    promo_file: string;
    unic: string;
    pilots: IPilotRcPilots[];
    type: string;
    place: string;
    country: string;
    city: string;
    rules: string;
    max_pilots: string;
    fname: string;
    lname: string;
    osd_name: string;
}

export interface IRcPilotsResponse {
    data: ICompetitionRcPilots[];
    descr: string;
    resp: string;
}
