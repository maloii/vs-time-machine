import { DateTime } from 'luxon';
import { ISportsman } from './ISportsman';
import { IRound } from './IRound';
import { IGate } from './IGate';

export interface ICompetition {
  _id: string;
  name: string;
  logo?: string;
  dateCreate: DateTime;
  selected: boolean;
  skipFirstGate?: boolean;
  sportsmen: ISportsman[];
  rounds: IRound[];
  gates: IGate[];
}
