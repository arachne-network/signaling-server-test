// import { createClient } from 'redis';

// class _RedisConnectionBase{
//     private client: any;

//     constructor(url?: string, port : number = 6379){
//         this.client = createClient(
//             {
//                 url : url || process.env.REDIS_URL
//             }
//         );
//         this.client.on('error', (err : string)=> console.log('Redis Client Error', err));
//     }

//     async connect(){
//         await this.client.connect();
//     }
// }

// class RedisConnection extends _RedisConnectionBase{
//     static instance: RedisConnection;

//     constructor(url: string, port : number = 6379){
//         super(url, port);
//         if(RedisConnection.instance){
//             return RedisConnection.instance;
//         }
//         return this;
//     }
// }


import { createClient, RedisClientType } from 'redis';

type KeyMap = Map<string, any>;
class LocalCache{
    private cache: KeyMap = new Map();

    get(key: string){
        console.log(`[LocalCache]: ${key} get`);
        return this.cache.get(key);
    }

    set(key: string, value: string){
        console.log(`[LocalCache]: ${key} set to ${value}`);
    }
}


class Cache{
    private client: RedisClientType | LocalCache;
    private isRedis : boolean = false;

    constructor(){
        const redisUrl = process.env.REDIS_URL;
        if(redisUrl)
        {
            this.isRedis = true;
            this.client = createClient({url: redisUrl});
            this.client.on('error', (err : string)=> console.log('Redis Client Error', err));
        } else{
            this.client = new LocalCache();
        }
    }

    set(key: string, value: string){
        this.client.set(key, value);
    }

    get(key: string){
        return this.client.get(key);
    }
}

export default new Cache();