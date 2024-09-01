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

    async saveUserToRoom(socketId: string, roomId: string){
        await this.client.set(`${socketId}`, roomId);
    }

    async getUserToRoom(socketId : string) : Promise<string | null> {
        try{
            const room = await this.client.get(`${socketId}`);
            return room;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}

export const userCache : UserCache = new UserCache();