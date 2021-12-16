const Datastore = window.require('nedb');

export const dbLogs = new Datastore({ filename: 'logs' });
dbLogs.loadDatabase();

export const insertLap = (type: string, data: string) => {
  dbLogs.insert({ type, data });
};

export const selectLaps = (type: string, callback: (err: any, docs: any) => any) => {
  return dbLogs.find({ type }, callback);
};
