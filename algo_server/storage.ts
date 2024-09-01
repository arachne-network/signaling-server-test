import { Graph } from "./types/graph";

export class Storage {
    private networks: Map<string, Graph>;
    constructor() {
        this.networks = new Map<string, Graph>;
    }

    getNetwork(roomId: string): Graph | null {
        return this.networks.get(roomId) || null ;
    }

    addNetwork(roomId: string): Graph {
        const newNetwork = new Graph(roomId);
        this.networks.set(roomId, newNetwork);

        return newNetwork;
    }

    removeNetwork(roomId: string) {
        this.networks.has(roomId) && this.networks.delete(roomId);
    }
}