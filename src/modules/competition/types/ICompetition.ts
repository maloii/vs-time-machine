import { DateTime } from 'luxon';

export interface ICompetition {
  id: number;
  name: string;
  logo?: string;
  dateCreate: DateTime;
  selected: boolean;
  skipFirstGate?: boolean;
}
