import { RedisClientType } from "redis";
import { IUser } from "../../interfaces/IUser";
import {RedisClient } from "./redis.connection"

// cache to store socketid to user
class UserCache extends RedisClient{
    constructor(){
        super();
    }

    async saveStreamer(socketId: string, roomId : string){
        await this.client.set(`streamer:${roomId}`, socketId);
    }

    async getStreamer(roomId: string) : Promise<string | null>{
        try{
            const streamer = await this.client.get(`streamer:${roomId}`);
            return streamer;
        }catch(err){
            console.error(err);
            return null;
        }
    }
}

export const userCache : UserCache = new UserCache();