import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';

export interface ICountLapsReportRow {
    memberGroupId: string;
    team?: ITeam;
    sportsman?: ISportsman;
    count: number;
    minLap: number;
    gap?: number;
    rel?: number;
}
