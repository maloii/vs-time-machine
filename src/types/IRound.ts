import { DateTime } from 'luxon';
import { TypeRound } from './TypeRound';
import { TypeRace } from './TypeRace';
import { IGroup } from './IGroup';

export interface IRound {
  _id: string;
  dateCreate: DateTime;
  name: string;
  sort: number;
  selected: boolean;
  typeRound: TypeRound;
  typeRace: TypeRace;
  groups: IGroup[];
}
