import {Room} from "./interfaces";
import cache from "./core/db/db";

export const selectPeer = async (roomId: string) => {
    // 일단은 streamer에게 쏜다고 하자
    const users : string[] = await cache.sMembers(roomId);

    return users[0];
  }