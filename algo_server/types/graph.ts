import { User } from "./user";
import { Link } from "./Link";

export class Graph {
    private nodes;
    private edges;
    private id: string;
    constructor(id: string) {
        this.nodes = new Map<string, User>;
        this.edges = new Map<string, Set<Link>>;
        this.id = id;
    }

    getId() {
        return this.id;
    }

    addNode(user: User) {
        this.nodes.has(user.id) || this.nodes.set(user.id, user);
        this.edges.has(user.id) || this.nodes.set(user.id, user);
        this.edges.set(user.id, new Set<Link>);
    }

    removeNode(id: string) {
        const user = this.nodes.get(id);
        if(!user) return;
        
        const idx = user.parent?.childs.indexOf(user);
        if(idx && idx !== -1) user.parent?.childs.splice(idx, 1);
        
        const links = this.getEdges(id);
        for(const link of links) {
            link.child.parent = null;
        }
        links.clear();
        this.edges.delete(id);
        this.nodes.delete(id);
    }

    getNode(id: string): User | null {
        return this.nodes.get(id) || null;
    }

    addEdge(parent: User, child: User, weight:number) {
        const links = this.edges.get(parent.id) || new Set<Link>;
        parent.childs.push(child);
        child.parent = parent;
        links.add({
            parent,
            child,
            weight
        });
        this.edges.set(parent.id, links);
    }

    removeEdge(link: Link) {
        const parent = link.parent;
        const child = link.child;
        const idx = parent.childs.indexOf(child);
        parent.childs.splice(idx, 1);
        if(child.parent === parent) child.parent = null;

        this.getEdges(parent.id).delete(link);
    }

    getEdges(id: string): Set<Link> {
        return this.edges.get(id) || new Set<Link>;
    }

    findAvailableNode(): User | null {
        for (const [id, links] of this.edges) {
            console.log(`iter ${id}: ${links} ${links.size}`);
            if (links.size < 2) {
                return this.getNode(id);
            }
        }
        return null;
    }

    isEmpty(): boolean {
        return this.nodes.size == 0 ? true : false;
    }
}