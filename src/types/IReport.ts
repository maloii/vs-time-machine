import { TypeReport } from '@/types/TypeReport';
import { TypeRoundReport } from '@/types/TypeRoundReport';

export interface IReport {
    _id: string;
    competitionId: string;
    roundId?: string;
    name: string;
    type: TypeReport;
    typeRound: TypeRoundReport;
    notCountedRounds?: number;
    onlySportsmen?: boolean;
    simplified?: boolean;
    count?: number;
}
