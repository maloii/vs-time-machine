import { ICompetition } from '../modules/competition/types/ICompetition';

const Datastore = window.require('nedb-promises');
export const db = new Datastore({ filename: 'db/competition' });

db.load().then(() => {});

export const getNextId = () => {
  return db
    .find<ICompetition>({})
    .sort({ id: -1 })
    .limit(1)
    .then((docs) => (docs?.[0].id || 0) + 1);
};
export const insertCompetition = async (competition: ICompetition): Promise<ICompetition> => {
  const id = await getNextId();
  console.log(id);
  return db.insert({ ...competition, id });
};

export const findCompetitionById = (id: number | string): Promise<ICompetition[]> => {
  return db.find({ id });
};

export const findCompetitionSelected = (): Promise<ICompetition[]> => {
  return db.find({ selected: true });
};

export const findCompetitionAll = (): Promise<ICompetition[]> => {
  return db.find({});
};

export const updateCompetitionById = (id: number, competition: ICompetition): Promise<number> => {
  return db.update({ id }, competition, {});
};

export const removeCompetitionById = (id: number): Promise<number> => {
  return db.remove({ id }, {});
};
