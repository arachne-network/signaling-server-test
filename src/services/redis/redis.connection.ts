import { createClient } from "redis";


// todo : get redisUrl from config file
const redisUrl : string = process.env.REDIS_URL || "redis://localhost:6379";

export class RedisClient{
    protected client;

    constructor(){
        this.client = createClient({ url: redisUrl });
        this.error();
    }

    async connect(){
        this.error();
        await this.client.connect();
    }

    error(){
        this.client.on("error", (err) => {
            console.error(err);
        });
    }
}
