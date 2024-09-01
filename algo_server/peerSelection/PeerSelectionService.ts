import { User } from "../types/user";
import { Graph } from "../types/graph";
import { Link } from "../types/Link";
import { store } from "../index";

export interface Connection {
    parent_id: string | null,
    child_id: string
}

export class PeerSelectionService {
    // TODO: State Management
    constructor() { }

    public insert(id: string, roomId: string): Connection | null {
        const network = store.getNetwork(roomId) || store.addNetwork(roomId);
        const node = network.getNode(id);
        if(node) return { parent_id: node.parent!?.id, child_id: id };
        const parent = this.findAvailableParent(roomId);
        const user: User = {
            id,
            isHosting: network.isEmpty(),
            parent,
            childs: []
        }
        network.addNode(user);
        parent && network.addEdge(parent, user, 1);
        return parent? { parent_id: parent.id, child_id: id } : null;
    }

    // user must not a host
    //TODO: Error handling if not exists
    public delete(id: string, roomId: string): Connection[] {
        const network = store.getNetwork(roomId);
        if(!network) return [];
        const user = network.getNode(id);
        if(!user) return [];
        const parent = user.parent;
        if(!parent) {
            store.removeNetwork(roomId);
            return [];
        };
        const links = Array.from(network.getEdges(id));
        const ret = [];
        for(const link of links) {
            network.addEdge(parent, link.child, link.weight);
            ret.push({ parent_id: parent.id, child_id: link.child.id });
            network.removeEdge(link);
        }

        network.removeNode(id);
        return ret;
    }

    private findAvailableParent(roomId: string): User | null {
        const network = store.getNetwork(roomId);
        return network ? network.findAvailableNode() : null;
    }
}