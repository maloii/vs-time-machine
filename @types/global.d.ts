import Datastore from 'nedb-promises';

declare global {
    interface Window {
        require(moduleSpecifier: 'nedb-promises'): typeof Datastore;
    }
}
