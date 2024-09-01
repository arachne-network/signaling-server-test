export interface User {
    id: string;
    isHosting: boolean;
    parent: User | null;
    childs: User[];
}