export interface ITeam {
    _id: string;
    competitionId: string;
    name: string;
    photo: string;
    city: string;
    country: string;
    position?: number;
    selected: boolean;
    sportsmenIds: string[];
}
