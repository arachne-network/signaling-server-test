import {Room} from "./interfaces";


export const selectPeer = (room: Room) => {
    // 일단은 streamer에게 쏜다고 하자
    
    let peer = room.streamer;
    for (const viewer of room.viewers) {
      if(viewer.isHosting === false) {
        peer = viewer;
        break;
      }
    }

    return peer.id;
  }