import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';

export interface IBestLapReportRow {
    memberGroupId: string;
    team?: ITeam;
    sportsman?: ISportsman;
    timeLap?: number;
    gap?: number;
    rel?: number;
    average: number;
}
