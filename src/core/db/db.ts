


import { createClient, RedisClientType } from 'redis';

type KeyMap = Map<string, any>;
class LocalCache{
    private cache: KeyMap = new Map();

    get(key: string){
        console.log(`[LocalCache]: ${key} get`);
        return this.cache.get(key);
    }

    set(key: string, value: string){
        this.cache.set(key, value);
    }

    sAdd(key: string, value: string){
        if(!this.cache.has(key)){
            this.cache.set(key, new Set());
        }
        const set = this.cache.get(key) as Set<string>;
        set.add(value);
    }

    sHas(key: string, value: string){
        return this.cache.get(key).has(key);
    }

    sCard(key: string){
        return this.cache.get(key).size;
    }

    sRem(key: string, value: string){
        this.cache.get(key).delete(value);
    }

    sMembers(key: string){
        return Array.from(this.cache.get(key));
    }

    delete(key: string){
        this.cache.delete(key);
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

    async set(key: string, value: any){
        this.client.set(key, value);
    }

    async get(key: string){
        return this.client.get(key);
    }

    async sSet(key: string, value: string){
        if(this.isRedis){
            (this.client as RedisClientType).sAdd(key, value);
        }
        else{
            (this.client as LocalCache).sAdd(key, value);
        }
    }

    async sHas(key: string, value: string){
        if(this.isRedis){
            return (this.client as RedisClientType).sIsMember(key, value);
        }
        else{
            return (this.client as LocalCache).sHas(key, value);
        }
    }

    async sCard(key: string){
        if(this.isRedis){
            return (this.client as RedisClientType).sCard(key);
        }
        else{
            return (this.client as LocalCache).sCard(key);
        }
    }

    async sRem(Key: string, value: string){
        if(this.isRedis){
            (this.client as RedisClientType).sRem(Key, value);
        } else {
            (this.client as LocalCache).sRem(Key, value);
        }
    }

    async sMembers(key: string) : Promise<any[]> {
        if(this.isRedis){
            return (this.client as RedisClientType).sMembers(key);
        } else {
            return (this.client as LocalCache).sMembers(key);
        }
    }

    getClient(){
        // return this.client when the type of the client is RedisClientType
        if(this.isRedis){
            return this.client as RedisClientType;
        }
        else{
            throw new Error('LocalCache does not have a client');
        }
    }

    async del(key: string){
        if(this.isRedis){
            (this.client as RedisClientType).del(key);
        }
        else{
            (this.client as LocalCache).delete(key);
        }
    }
}

export default new Cache();