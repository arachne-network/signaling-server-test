import {Room} from "./interfaces";


export const selectPeer = (room: Room) => {
    // 일단은 streamer에게 쏜다고 하자
    return room.streamer.id;
  }