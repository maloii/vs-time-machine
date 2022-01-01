import { makeAutoObservable } from 'mobx';
import { ICompetition } from '@/types/ICompetition';
import { IRound } from '@/types/IRound';
import { ISportsman } from '@/types/ISportsman';
import { ITeam } from '@/types/ITeam';
import { IGroup } from '@/types/IGroup';
import { ILap } from '@/types/ILap';

export class Story {
    public competitions: Array<ICompetition> = [];
    public sportsmen: Array<ISportsman> = [];
    public teams: Array<ITeam> = [];
    public competition: ICompetition | undefined = undefined;
    public rounds: Array<IRound> = [];
    public groups: Array<IGroup> = [];
    public laps: Array<ILap> = [];

    public constructor() {
        makeAutoObservable(this);
    }

    public setCompetition = (newCompetition: ICompetition): void => {
        this.competition = newCompetition;
    };

    public setCompetitions = (newCompetitions: ICompetition[]): void => {
        this.competitions = newCompetitions;
    };

    public setSportsmen = (newSportsmen: ISportsman[]): void => {
        this.sportsmen = newSportsmen;
    };

    public setTeams = (newTeams: ITeam[]): void => {
        this.teams = newTeams;
    };

    public setRounds = (newRounds: IRound[]): void => {
        this.rounds = newRounds;
    };

    public setGroups = (newGroups: IGroup[]): void => {
        this.groups = newGroups;
    };

    public setLaps = (newLaps: ILap[]): void => {
        this.laps = newLaps;
    };
}

export const story = new Story();
