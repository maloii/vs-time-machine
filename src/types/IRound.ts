import { TypeRound } from './TypeRound';
import { TypeRace } from './TypeRace';
import { IGroup } from './IGroup';
import { TypeGenerateRound } from '@/types/TypeGenerateRound';
import { TypeParentEntity } from '@/types/TypeParentEntity';
import { TypeRaceElimination } from '@/types/TypeRaceElimination';
import { TypeStartRace } from "@/types/TypeStartRace";

export interface IRound {
    _id: string;
    competitionId: string;
    name: string;
    sort: number;
    selected: boolean;
    countLap: number;
    countSportsmen: number;
    maxTimeRace: number;
    minTimeLap: number;
    close: boolean;
    fromRoundCopy?: string;
    typeRound: TypeRound;
    typeRace: TypeRace;
    typeStartRace: TypeStartRace;
    typeParentEntity: TypeParentEntity;
    typeGenerateRound: TypeGenerateRound;
    typeRaceElimination: TypeRaceElimination;
    parentEntity?: string;
    countNextGo: number;
}
