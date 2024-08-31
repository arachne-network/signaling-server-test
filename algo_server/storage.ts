import { Graph } from "./types/graph";

export class Storage {
    private data;
    constructor() {
        this.data = {
            network: Graph
        };
    }

    getData() {
        return this.data;
    }
}