import { userCache } from "./services/redis/user.cache";

export const selectPeer = async (roomId : string , newSocketId: string) => {
    const streamer = await userCache.getStreamer(roomId);
    if(streamer){
        return streamer;
    }
    return "";
}
