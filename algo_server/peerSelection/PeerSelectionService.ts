import { User } from "../types/user";
import { Graph } from "../types/graph";
import { Link } from "../types/Link";

export class PeerSelectionService {
    // TODO: State Management
    static network: Graph;

    constructor() {
        PeerSelectionService.network = PeerSelectionService.network || new Graph();
    }

    public insert(id: string, isHosting: boolean) {
        const parent = this.findAvailableParent();
        const user: User = {
            id,
            isHosting,
            parent,
            childs: null
        }
        PeerSelectionService.network.addNode(user);
        parent && PeerSelectionService.network.addEdge(parent, user);
    }

    // user must not a host
    public delete(userId: string) {
        const user = PeerSelectionService.network.getNode(userId);
        if (user && user.parent) return;

        const links = Array.from(PeerSelectionService.network.getEdges(userId));
        user && PeerSelectionService.network.removeNode(user);

        for(const link of links) {
            user && user.parent && PeerSelectionService.network.addEdge(user.parent, link.child);
        }
    }

    private findAvailableParent(): User | null {
        return PeerSelectionService.network.findAvailableNode();
    }
}