import { makeAutoObservable } from 'mobx';
import { ICompetition } from '../types/ICompetition';

export class Story {
  public competitions: Array<ICompetition> = [];
  public competition: ICompetition | undefined = undefined;

  public constructor() {
    makeAutoObservable(this);
  }

  public setCompetition = (newCompetition: ICompetition): void => {
    this.competition = newCompetition;
  };

  public setCompetitions = (newCompetitions: ICompetition[]): void => {
    this.competitions = newCompetitions;
  };
}

export const story = new Story();
