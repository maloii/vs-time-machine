import Datastore from 'nedb-promises';

declare global {
    interface Window {
        api: any;
        require(moduleSpecifier: 'nedb-promises'): typeof Datastore;
    }
}
