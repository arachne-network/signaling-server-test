import { User } from "./user";

export interface Link {
    parent: User;
    child: User;
    weight: number;
}