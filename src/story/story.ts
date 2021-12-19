import { makeAutoObservable } from 'mobx';
import { ICompetition } from '@/types/ICompetition';
import { IRound } from '@/types/IRound';

export class Story {
    public competitions: Array<ICompetition> = [];
    public competition: ICompetition | undefined = undefined;
    public rounds: Array<IRound> = [];

    public constructor() {
        makeAutoObservable(this);
    }

    public setCompetition = (newCompetition: ICompetition): void => {
        this.competition = newCompetition;
    };

    public setCompetitions = (newCompetitions: ICompetition[]): void => {
        this.competitions = newCompetitions;
    };

    public setRounds = (newRounds: IRound[]): void => {
        this.rounds = newRounds;
    };
}

export const story = new Story();
