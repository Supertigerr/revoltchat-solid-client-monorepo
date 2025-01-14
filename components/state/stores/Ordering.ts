import { makeAutoObservable } from "mobx";

// TODO import { reorder } from "@revoltchat/ui";

import { clientController } from "@revolt/client";

// TODO import { clientController } from "../../controllers/client/ClientController";
import State from "../State";
import Persistent from "../interfaces/Persistent";
import Store from "../interfaces/Store";
import Syncable from "../interfaces/Syncable";

export interface Data {
    servers?: string[];
}

/**
 * Keeps track of ordering of various elements
 */
export default class Ordering implements Store, Persistent<Data>, Syncable {
    private state: State;

    /**
     * Ordered list of server IDs
     */
    private servers: string[];

    /**
     * Construct new Layout store.
     */
    constructor(state: State) {
        this.servers = [];
        makeAutoObservable(this);

        this.state = state;
        this.reorderServer = this.reorderServer.bind(this);
    }

    get id() {
        return "ordering";
    }

    toJSON() {
        return {
            servers: this.servers,
        };
    }

    hydrate(data: Data) {
        if (data.servers) {
            this.servers = data.servers;
        }
    }

    apply(_key: string, data: unknown, _revision: number): void {
        this.hydrate(data as Data);
    }

    toSyncable(): { [key: string]: object } {
        return {
            ordering: this.toJSON(),
        };
    }

    /**
     * All known servers with ordering applied
     */
    get orderedServers() {
        const client = clientController.getReadyClient();
        const known = new Set(client?.servers.keys() ?? []);
        const ordered = [...this.servers];

        const out = [];
        for (const id of ordered) {
            if (known.delete(id)) {
                out.push(client!.servers.get(id)!);
            }
        }

        for (const id of known) {
            out.push(client!.servers.get(id)!);
        }

        return out;
    }

    /**
     * Re-order a server
     */
    reorderServer(source: number, dest: number) {
        // TODO
        this.servers = (function reorder(list: any[], startIndex: number, endIndex: number) {
            const result = Array.from(list);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
        
            return result;
        })(
            this.orderedServers.map((x) => x._id),
            source,
            dest,
        );
    }
}
