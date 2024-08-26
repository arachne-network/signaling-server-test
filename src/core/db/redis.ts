import { createClient } from "redis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";


// client for socketio adapter
const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

export async function connectRedisAdapter(io: Server) {
    await Promise.all([
    pubClient.connect(),
    subClient.connect()
    ]); 
  io.adapter(createAdapter(pubClient, subClient));
}
