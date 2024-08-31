import { User } from "./user";
import { Link } from "./Link";

export class Graph {
    private nodes;
    private edges;
    constructor() {
        this.nodes = new Map<string, User>;
        this.edges = new Map<string, Set<Link>>;
    }

    addNode(user: User) {
        this.nodes.has(user.id) || this.nodes.set(user.id, user);
        this.edges.has(user.id) || this.nodes.set(user.id, user);
    }

    removeNode(user: User) {
        this.nodes.has(user.id) && this.nodes.delete(user.id);
    }

    addEdge(fromNode: User, toNode: User) {
        // this.edges.set(toNode.id, this.edges.get(toNode.id).add(Link));
        // this.nodes[toNode.id].push(fromNode.id);
    }

    removeEdge(fromNode: User, toNode: User) {
        // let node = this.nodes[fromNode];
        // if (
        //     this.nodes[fromNode].includes(toNode) &&
        //     this.nodes[toNode].includes(fromNode)
        // ) {
        //     this.nodes[fromNode][node.indexOf(toNode)] = "";
        //     this.nodes[toNode][node.indexOf(fromNode)] = "";
        // }
    }

    getNode(id: string): User | null {
        return this.nodes.get(id);
    }

    getEdges(id: string): Link[] {
        return this.edges.get(id) || [];
    }

    findAvailableNode(): User | null {
        for (const [id, links] of this.edges) {
            if (links.size < 2) {
                return this.getNode(id);
            }
        }
        return null;
    }
}