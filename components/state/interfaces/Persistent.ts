// ! TODO: this is a direct port of the state
// ! this will need to be polished up and integrated

import Store from "./Store";

/**
 * A data store which is persistent and should cache its data locally.
 */
export default interface Persistent<T> extends Store {
    /**
     * Serialise this data store.
     */
    toJSON(): unknown;

    /**
     * Hydrate this data store using given data.
     * @param data Given data
     */
    hydrate(data: T, revision: number): void;
}
