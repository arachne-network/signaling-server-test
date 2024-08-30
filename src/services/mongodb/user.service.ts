import {IUser } from "../../interfaces/IUser";
import { userModel } from "../../models/user.schema";

export class UserService { 
    async addUser(user : IUser) {
        await userModel.create(user);
    }


    async getUserByUserId(userId: string) {
        await userModel.findOne({userId});
    }
}

export const userService : UserService = new UserService();